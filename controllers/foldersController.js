const { validateFolder } = require("../validation/validateFolder");
const { validationResult } = require("express-validator");
const db = require("../db/queries");

// GET middlewares
module.exports.getNewFolder = (req, res, next) => {
  res.render("newFolder");
};

module.exports.getAllFolders = async (req, res, next) => {
  const { id } = req.user;
  const folders = await db.getFoldersByUserId(id);
  //console.log(folders);
  res.render("folders", { folders });
};

module.exports.getUpdateFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folder = await db.getFolderByFolderId(folderId);
  res.render("updateFolder", { folder: folder });
};

module.exports.getFilesFromFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folder = await db.getFolderByFolderId(folderId);
  const files = await db.getFilesByFolderId(folderId);
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
      await db.createFolder(folderName, id);
      res.redirect("/");
    } else {
      return res.status(400).render("newFolder", { errors: errors.array() });
    }
  },
];

module.exports.deleteFolder = async (req, res, next) => {
  const { folderId } = req.params;
  await db.deleteFolder(folderId);
  res.redirect("/folders/");
};

module.exports.updateFolder = [
  validateFolder,
  async (req, res, next) => {
    const { folderId } = req.params;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { folderName } = req.body;
      await db.updateFolder(Number(folderId), folderName);
      //console.log(folder);
      res.redirect("back");
    } else {
      const folder = await db.getFolderByFolderId(folderId);
      return res
        .status(400)
        .render("updateFolder", { folder: folder, errors: errors.array() });
    }
  },
];
