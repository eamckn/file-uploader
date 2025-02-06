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

// GET middlewares
module.exports.getHome = (req, res, next) => {
  res.render("index");
};

module.exports.getSignUp = (req, res, next) => {
  res.render("sign-up");
};

module.exports.getLogIn = (req, res, next) => {
  res.render("log-in");
};

module.exports.getNewFolder = (req, res, next) => {
  res.render("newFolder");
};

module.exports.getUpdateFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.render("updateFolder", { folder: folder });
};

module.exports.getAllFolders = async (req, res, next) => {
  const { id } = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      userId: id,
    },
  });
  //console.log(folders);
  res.render("folders", { folders });
};

module.exports.getFilesFromFolder = async (req, res, next) => {
  const { id } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(id),
    },
  });
  const files = await prisma.file.findMany({
    where: {
      folderId: Number(id),
    },
  });
  res.render("files", { files: files, folder: folder });
};

module.exports.deleteFolder = async (req, res, next) => {
  const { id } = req.params;
  await prisma.file.deleteMany({
    where: {
      folderId: Number(id),
    },
  });
  await prisma.folder.delete({
    where: {
      id: Number(id),
    },
  });
  res.redirect("/folders");
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

module.exports.createFolder = async (req, res, next) => {
  const { id } = req.user;
  const { folderName } = req.body;
  await prisma.folder.create({
    data: {
      name: folderName,
      userId: id,
    },
  });
  res.redirect("/");
};

module.exports.updateFolder = async (req, res, next) => {
  const { id } = req.params;
  const { folderName } = req.body;
  await prisma.folder.update({
    where: {
      id: Number(id),
    },
    data: {
      name: folderName,
    },
  });
  res.redirect("/");
};

module.exports.uploadFile = [
  upload.single("file"),

  //   async (req, res, next) => {
  //     const { id } = req.params;
  //     console.log(id);
  //     console.log(req.file);
  //     res.redirect("/");
  //   },
  async (req, res, next) => {
    const uploadTime = new Date();
    const { id } = req.params;
    //console.log(uploadTime);
    await prisma.file.create({
      data: {
        file: req.file.originalname,
        size: req.file.size,
        uploadTime: uploadTime,
        folderId: Number(id),
      },
    });
    //console.log(req.file);
    res.redirect("/");
  },
];
