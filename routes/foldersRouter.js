const router = require("express").Router();
const indexController = require("../controllers/indexController");

// GET routes
router.get("/", indexController.getAllFolders);
router.get("/update/:id", indexController.getUpdateFolder);
router.get("/delete/:id", indexController.deleteFolder);
router.get("/:id/files/", indexController.getFilesFromFolder);

// POST routes
router.post("/:id/files", indexController.uploadFile);
router.post("/:folderId/files/:id/download", indexController.downloadFile);
router.post("/update/:id", indexController.updateFolder);

module.exports = router;
