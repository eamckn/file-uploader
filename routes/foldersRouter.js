const router = require("express").Router();
const foldersController = require("../controllers/foldersController");
const filesController = require("../controllers/filesController");
const { userAuthenticated } = require("../validation/userAuthenticated");

// GET routes
router.get("/", userAuthenticated, foldersController.getAllFolders);
router.get("/new-folder", userAuthenticated, foldersController.getNewFolder);
router.get(
  "/update/:folderId",
  userAuthenticated,
  foldersController.getUpdateFolder
);
router.get(
  "/delete/:folderId",
  userAuthenticated,
  foldersController.deleteFolder
);
router.get(
  "/:folderId/files/",
  userAuthenticated,
  foldersController.getFilesFromFolder
);

// POST routes
router.post("/new-folder", userAuthenticated, foldersController.createFolder);
router.post(
  "/update/:folderId",
  userAuthenticated,
  foldersController.updateFolder
);
router.post("/:folderId/files", userAuthenticated, filesController.uploadFile);
router.post(
  "/:folderId/files/:fileId/download",
  userAuthenticated,
  filesController.downloadFile
);

module.exports = router;
