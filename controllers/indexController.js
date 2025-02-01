const { PrismaClient } = require("@prisma/client");
const multer = require("multer");

// Prisma client instantialization
const prisma = new PrismaClient();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports.getHome = (req, res, next) => {
  res.render("index");
};

module.exports.getSignUp = (req, res, next) => {
  res.render("sign-up");
};

module.exports.getLogIn = (req, res, next) => {
  res.render("log-in");
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

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

module.exports.uploadFile = [
  upload.single("file"),
  async (req, res, next) => {
    console.log(req.file);
    res.redirect("/");
  },
];
