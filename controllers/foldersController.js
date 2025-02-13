const { PrismaClient } = require("@prisma/client");

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

module.exports.updateFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const { folderName } = req.body;
  await prisma.folder.update({
    where: {
      id: Number(folderId),
    },
    data: {
      name: folderName,
    },
  });
  res.redirect("/");
};
