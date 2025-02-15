const { body } = require("express-validator");

module.exports.validateFolder = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("Folder name cannot be blank."),
];
