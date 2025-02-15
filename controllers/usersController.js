const bcrypt = require("bcryptjs");
const { validateUser } = require("../validation/validateUser");
const { validationResult } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require("express-async-handler");

// GET middlewares
module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

// POST middlewares
module.exports.createUser = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    //console.log(errors.array());
    //console.log(typeof errors.array());
    if (errors.isEmpty()) {
      const { firstName, lastName, email, password } = req.body;
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          await db.createUser(firstName, lastName, email, hashedPassword);
          res.redirect("/log-in");
        }
      });
    } else {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }
  }),
];
