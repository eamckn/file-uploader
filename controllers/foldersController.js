const { PrismaClient } = require("@prisma/client");
const { validateFolder } = require("../validation/validateFolder");
const { validationResult } = require("express-validator");

// Prisma client initialization
const prisma = new PrismaClient();

// GET middlewares
module.exports.getNewFolder = (req, res, next) => {
  res.render("newFolder");
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

module.exports.getUpdateFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
  });
  res.render("updateFolder", { folder: folder });
};

module.exports.getFilesFromFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
  });
  const files = await prisma.file.findMany({
    where: {
      folderId: Number(folderId),
    },
  });
  res.render("files", { files: files, folder: folder });
};

// POST middlewares
module.exports.createFolder = [
  validateFolder,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { id } = req.user;
      const { folderName } = req.body;
      await prisma.folder.create({
        data: {
          name: folderName,
          userId: id,
        },
      });
      res.redirect("/");
    } else {
      return res.status(400).render("newFolder", { errors: errors.array() });
    }
  },
];

module.exports.deleteFolder = async (req, res, next) => {
  const { folderId } = req.params;
  await prisma.file.deleteMany({
    where: {
      folderId: Number(folderId),
    },
  });
  await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });
  res.redirect("/folders/");
};

module.exports.updateFolder = [
  validateFolder,
  async (req, res, next) => {
    const { folderId } = req.params;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { folderName } = req.body;
      await prisma.folder.update({
        where: {
          id: Number(folderId),
        },
        data: {
          name: folderName,
        },
      });
      //console.log(folder);
      res.redirect("back");
    } else {
      const folder = await prisma.folder.findUnique({
        where: {
          id: Number(folderId),
        },
      });
      return res
        .status(400)
        .render("updateFolder", { folder: folder, errors: errors.array() });
    }
  },
];
