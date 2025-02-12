const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

// Prisma client initialization
const prisma = new PrismaClient();

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
  async (req, res, next) => {
    const uploadTime = new Date();
    const { id } = req.params;
    const { secure_url: cloudinaryUrl } = await cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "auto" }
    );
    //console.log(url);
    await prisma.file.create({
      data: {
        file: req.file.originalname,
        size: req.file.size,
        uploadTime,
        cloudinaryUrl,
        folderId: Number(id),
      },
    });
    console.log(req.file);
    res.redirect("/");
  },
];

module.exports.downloadFile = async (req, res, next) => {
  const { id } = req.params;
  const fileToDownload = await prisma.file.findUnique({
    where: {
      id: Number(id),
    },
  });
  //console.log(fileToDownload);
  res.download(`uploads/${fileToDownload.file}`);
};
