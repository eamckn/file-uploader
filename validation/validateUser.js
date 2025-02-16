const { body } = require("express-validator");
const db = require("../db/queries");

// Constants
const blankMsg = "cannot be left blank.";
const passwordMsg = "Password must contain at least ";
const DIGITS = "1234567890";

// Validation chain for user sign-up
module.exports.validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name " + blankMsg)
    .bail(),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name " + blankMsg)
    .bail(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email " + blankMsg)
    .bail()
    .isEmail()
    .withMessage("Must be a valid email address.")
    .bail()
    // Check if email is already in user database
    .custom(async (value) => {
      const emailInUse = await db.getUserByEmail(value);
      if (emailInUse) {
        throw new Error(
          "This email is already in use. Please sign up using a different email address."
        );
      } else return true;
    })
    .bail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password " + blankMsg)
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least six characters long.")
    .bail()
    // Check if password contains at least one uppercase letter
    .custom(async (value) => {
      const hasUpperCase = value !== value.toLowerCase();
      if (!hasUpperCase) {
        throw new Error(passwordMsg + "one uppercase letter.");
      } else return true;
    })
    .bail()
    // Check if password contains at least one lowercase letter
    .custom(async (value) => {
      const hasLowerCase = value !== value.toUpperCase();
      if (!hasLowerCase) {
        throw new Error(passwordMsg + "one lowercase letter.");
      } else return true;
    })
    .bail()
    // Check if password contains at least three numbers letter
    .custom(async (value) => {
      let numCount = 0;
      const chars = value.split("");
      chars.forEach((char) => {
        if (DIGITS.includes(char)) {
          numCount++;
        }
      });
      if (numCount < 3) {
        throw new Error(passwordMsg + "three numbers.");
      } else return true;
    })
    .bail(),
];
