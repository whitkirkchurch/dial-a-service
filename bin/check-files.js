#!/usr/bin/env node

const fs = require("fs");

let data_file = fs.readFileSync("data.json");
let data = JSON.parse(data_file);

let errors = false;

data.services.forEach(function (service) {
  if (!fs.existsSync("audio/" + service.file)) {
    console.error(
      'File "' +
        service.file +
        '" not found for service "' +
        service.title +
        '"'
    );
    errors = true;
  }
});

if (errors) {
  console.log("Some missing files were found!");
  process.exit(1);
} else {
  console.log("All files found OK.");
}
