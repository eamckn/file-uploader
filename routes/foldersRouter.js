const router = require("express").Router();
const foldersController = require("../controllers/foldersController");
const filesController = require("../controllers/filesController");

// GET routes
router.get("/", foldersController.getAllFolders);
router.get("/new-folder", foldersController.getNewFolder);
router.get("/update/:folderId", foldersController.getUpdateFolder);
router.get("/delete/:folderId", foldersController.deleteFolder);
router.get("/:folderId/files/", foldersController.getFilesFromFolder);

// POST routes
router.post("/new-folder", foldersController.createFolder);
router.post("/update/:folderId", foldersController.updateFolder);
router.post("/:folderId/files", filesController.uploadFile);
router.post("/:folderId/files/:fileId/download", filesController.downloadFile);

module.exports = router;
