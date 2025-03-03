const axios = require("axios");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { validateFile } = require("../validation/validateFile");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");
const db = require("../db/queries");

// POST middlewares
module.exports.uploadFile = [
  upload.single("file"),
  validateFile,
  asyncHandler(async (req, res, next) => {
    const { folderId } = req.params;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const uploadTime = new Date();
      const { secure_url: cloudinaryUrl, asset_id: cloudinaryId } =
        await cloudinary.uploader.upload(req.file.path, {
          resource_type: "auto",
        });
      await db.createFile(
        req.file.originalname,
        req.file.size,
        uploadTime,
        cloudinaryUrl,
        cloudinaryId,
        Number(folderId)
      );
      fs.unlink(`./${req.file.path}`, (err) => {
        if (err) throw err;
        console.log(
          "Uploaded file was successfully removed from local uploads folder."
        );
      });
      res.redirect(".");
    } else {
      const folder = await db.getFolderByFolderId(folderId);
      const files = await db.getFilesByFolderId(folderId);
      return res.status(400).render("files", {
        files: files,
        folder: folder,
        errors: errors.array(),
      });
    }
  }),
];

module.exports.downloadFile = asyncHandler(async (req, res, next) => {
  const { fileId } = req.params;
  const file = await db.getFileByFileId(fileId);
  // Get file data as readable stream
  const response = await axios.get(file.cloudinaryUrl, {
    responseType: "stream",
  });

  if (response.statusText !== "OK") {
    throw new Error(
      "Connection error. Please check your internet connection and try again."
    );
  }

  // Set response headers to enable file download
  res.setHeader("Content-Disposition", `attachment; filename="${file.file}"`);
  res.setHeader(
    "Content-Type",
    response.headers["content-type"] || "application/octet-stream"
  );

  // Pipe the readable stream to the response
  response.data.pipe(res);
  res.end();
});
