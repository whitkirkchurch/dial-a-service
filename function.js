exports.handler = function (context, event, callback) {
  var got = require("got");
  let twiml = new Twilio.twiml.VoiceResponse();

  let das_root_url = context.das_root_url;

  let data_url = das_root_url + "data.json";

  got(data_url)
    .then(function (response) {
      data = JSON.parse(response.body);

      twiml.say("Thanks for calling " + data.church_name + ".");

      callback(null, twiml);
    })
    .catch(function (error) {
      callback(error);
    });
};
