var das = require("../function.js");

var assert = require("assert");

describe("Dial-A-Service", function () {
  var services;

  describe("ServiceData", function () {
    before(function () {
      json = require("../test/fixtures.json");
    });

    it("correctly returns the file name", function () {
      service = new das.ServiceData(json.services[0]);
      assert.equal(service.fileName, "2020-06-11.mp3");
    });

    it("correctly returns the date string", function () {
      service = new das.ServiceData(json.services[0]);
      assert.equal(service.dateString, "Thursday the 11th of June");
    });

    it("correctly returns the descriptor string for a service with a title", function () {
      service = new das.ServiceData(json.services[0]);
      assert.equal(
        service.serviceDescriptorString,
        "Corpus Christi, Thursday the 11th of June"
      );
    });

    it("correctly returns the descriptor string for a service without a title", function () {
      service = new das.ServiceData(json.services[3]);
      assert.equal(service.serviceDescriptorString, "Sunday the 24th of May");
    });

    it("correctly detects future services", function () {
      pastService = new das.ServiceData(json.services[0]);
      futureService = new das.ServiceData(json.services[11]);
      assert.equal(pastService.serviceInFuture, false);
      assert.equal(futureService.serviceInFuture, true);
    });
  });

  describe("ChurchData", function () {
    before(function () {
      json = require("../test/fixtures.json");
      church = new das.ChurchData(json);
    });

    it("churchName returns the church's name", function () {
      assert.equal(church.churchName, "Test Fixtures Church");
    });

    it("orderedServices returns expected services in order", function () {
      assert.deepEqual(
        church.orderedServices.map((f) => f.dateString),
        [
          "Sunday the 14th of June",
          "Thursday the 11th of June",
          "Sunday the 31st of May",
          "Saturday the 30th of May",
          "Friday the 29th of May",
          "Thursday the 28th of May",
          "Wednesday the 27th of May",
          "Tuesday the 26th of May",
          "Monday the 25th of May",
          "Sunday the 24th of May",
          "Thursday the 21st of May",
        ]
      );
    });

    it("latestService returns the latest service", function () {
      assert.equal(church.latestService.dateString, "Sunday the 14th of June");
    });

    it("servicesForMenu returns no more than nine services", function () {
      assert.equal(church.servicesForMenu.length, 9);
    });
  });
});
