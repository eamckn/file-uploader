const { PrismaClient } = require("@prisma/client");

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
  const { email, password } = req.body;
  await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });
  res.redirect("/");
};
