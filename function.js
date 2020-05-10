exports.handler = function (context, event, callback) {
  var got = require("got");
  let twiml = new Twilio.twiml.VoiceResponse();

  let das_root_url = context.das_root_url;

  let data_url = das_root_url + "data.json";

  got(data_url)
    .then(function (response) {
      data = JSON.parse(response.body);

      const services = data.services.slice(0, 10); // Get the latest 9 services

      if (
        data === undefined ||
        services === undefined ||
        services.length === 0
      ) {
        twiml.say(
          "Sorry , we ran into a problem fetching the latest services."
        );
        callback(null, twiml);
        twiml.hangup();
      }

      // No digit pressed? Spit out the root menu.
      if (event.Digits === undefined) {
        const service_menu = services
          .map(
            (service, index) => "Press " + (index + 1) + " for " + service.title
          )
          .join(",");

        twiml
          .gather({ numDigits: 1 })
          .say("Thanks for calling " + data.church_name + ". " + service_menu);
      } else {
        // Key pressed, do the thing

        const service_id = event.Digits - 1;
        const service = services[service_id];

        if (service === undefined) {
          twiml.say("Sorry, we ran into a problem fetching the service.");
          callback(null, twiml);
          twiml.hangup();
        }

        twiml.say(
          "Please wait whilst we fetch the service. It may take a few seconds to connect you."
        );
        let service_url = das_root_url + "audio/" + service.file;
        twiml.play(service_url);
        twiml.hangup();
      }
      callback(null, twiml);
    })
    .catch(function (error) {
      callback(error);
    });
};
