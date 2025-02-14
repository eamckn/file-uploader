const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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
module.exports.createUser = async (req, res, next) => {
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
  //res.redirect("/");
};
