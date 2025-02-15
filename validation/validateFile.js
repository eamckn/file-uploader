const { check } = require("express-validator");

module.exports.validateFile = [
  check("file").custom((file, { req }) => {
    if (!req.file) {
      throw new Error("No file selected. Please select a file to upload.");
    } else return true;
  }),
];
