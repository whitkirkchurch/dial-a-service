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
      assert.equal(service.dateString, "Thursday 11th June");
    });

    it("correctly returns the descriptor string for a service with a title", function () {
      service = new das.ServiceData(json.services[0]);
      assert.equal(
        service.serviceDescriptorString,
        "Corpus Christi, Thursday 11th June"
      );
    });

    it("correctly returns the descriptor string for a service without a title", function () {
      service = new das.ServiceData(json.services[3]);
      assert.equal(service.serviceDescriptorString, "Sunday 24th May");
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

    it("orderedServices correctly orders services newest first", function () {
      assert.deepEqual(
        church.orderedServices.map((f) => f.dateString),
        [
          "Sunday 14th June",
          "Thursday 11th June",
          "Sunday 24th May",
          "Thursday 21st May",
        ]
      );
    });

    it("latestService returns the latest service", function () {
      assert.equal(church.latestService.dateString, "Sunday 14th June");
    });
  });
});