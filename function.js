var moment = require("moment");

class ServiceData {
  constructor(service) {
    this.data = service;
  }

  get fileName() {
    return this.data.file;
  }

  get dateTimeObject() {
    return moment(this.data.datetime);
  }

  get dateString() {
    var datetime = this.dateTimeObject;
    return (
      datetime.format("dddd") +
      " the " +
      datetime.format("Do") +
      " of " +
      datetime.format("MMMM")
    );
  }

  get serviceDescriptorString() {
    if ("title" in this.data) {
      return this.data.title + ", " + this.dateString;
    } else {
      return this.dateString;
    }
  }

  get serviceInFuture() {
    return this.dateTimeObject.isAfter();
  }
}

class ChurchData {
  constructor(json) {
    this.data = json;
  }

  get churchName() {
    return this.data.church_name;
  }

  get services() {
    return this.data.services
      .map((f) => new ServiceData(f))
      .filter((f) => !f.serviceInFuture);
  }

  get orderedServices() {
    return this.services.sort((a, b) =>
      a.dateTimeObject < b.dateTimeObject ? 1 : -1
    );
  }

  get servicesForMenu() {
    return this.orderedServices.slice(0, 9);
  }

  get latestService() {
    return this.orderedServices[0];
  }
}

exports.ServiceData = ServiceData;
exports.ChurchData = ChurchData;

exports.handler = function (context, event, callback) {
  var got = require("got");
  let twiml = new Twilio.twiml.VoiceResponse();

  let das_root_url = context.das_root_url;

  let data_url = das_root_url + "data.json";

  got(data_url)
    .then(function (response) {
      let churchData = new ChurchData(JSON.parse(response.body));

      const services = churchData.servicesForMenu;

      if (
        churchData === undefined ||
        churchData.orderedServices === undefined ||
        churchData.orderedServices.length === 0
      ) {
        twiml.say(
          "Sorry , we ran into a problem fetching the latest services."
        );
        callback(null, twiml);
        twiml.hangup();
      }

      // No digit pressed? Spit out the root menu.
      if (event.Digits === undefined) {
        const service_menu = Array.from(services)
          .map(function (service, index) {
            if (index === 0) {
              return (
                "Press " +
                (index + 1) +
                " for the service from " +
                service.serviceDescriptorString +
                "."
              );
            } else {
              return (
                "For " +
                service.serviceDescriptorString +
                ", press " +
                (index + 1) +
                "."
              );
            }
          })
          .join(" ");

        twiml
          .gather({ numDigits: 1 })
          .say(
            "Thanks for calling " + churchData.churchName + ". " + service_menu
          );
      } else {
        // Key pressed, do the thing

        const service_id = event.Digits - 1;
        const service = services[service_id];

        if (service === undefined || service.fileName === undefined) {
          twiml.say("Sorry, we ran into a problem fetching the service.");
          callback(null, twiml);
          twiml.hangup();
        }

        twiml.say(
          "Please wait whilst we fetch the service. It may take a few seconds to connect you."
        );
        let service_url = das_root_url + "audio/" + service.fileName;
        twiml.play(service_url);
        twiml.hangup();
      }
      callback(null, twiml);
    })
    .catch(function (error) {
      callback(error);
    });
};
