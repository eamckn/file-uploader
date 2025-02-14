const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validateUser } = require("../validation/validateUser");
const { validationResult } = require("express-validator");

// Prisma client initialization
const prisma = new PrismaClient();

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
  async (req, res, next) => {
    const errors = validationResult(req);
    //console.log(errors.array());
    //console.log(typeof errors.array());
    if (errors.isEmpty()) {
      const { firstName, lastName, email, password } = req.body;
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              password: hashedPassword,
            },
          });
          res.redirect("/log-in");
        }
      });
    } else {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }
  },
];
