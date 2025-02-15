const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");
const axios = require("axios");
const fs = require("fs");
const { validateFile } = require("../validation/validateFile");
const { validationResult } = require("express-validator");

// Prisma client initialization
const prisma = new PrismaClient();

// POST middlewares
module.exports.uploadFile = [
  upload.single("file"),
  validateFile,
  async (req, res, next) => {
    const { folderId } = req.params;
    const errors = validationResult(req);
    //console.log(errors);
    //console.log(req.file);
    if (errors.isEmpty()) {
      const uploadTime = new Date();
      const { secure_url: cloudinaryUrl, asset_id: cloudinaryId } =
        await cloudinary.uploader.upload(req.file.path, {
          resource_type: "auto",
        });
      //console.log(url);
      await prisma.file.create({
        data: {
          file: req.file.originalname,
          size: req.file.size,
          uploadTime,
          cloudinaryUrl,
          cloudinaryId,
          folderId: Number(folderId),
        },
      });
      //console.log(req.file);
      fs.unlink(`./${req.file.path}`, (err) => {
        if (err) throw err;
        console.log(
          "Uploaded file was successfully removed from local uploads folder."
        );
      });
      res.redirect(".");
    } else {
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
      return res.status(400).render("files", {
        files: files,
        folder: folder,
        errors: errors.array(),
      });
    }
  },
];

module.exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;
  const file = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
    },
  });
  // Get file data as readable stream
  const response = await axios.get(file.cloudinaryUrl, {
    responseType: "stream",
  });

  if (response.statusText !== "OK") {
    throw new Error("Connection error");
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
};
