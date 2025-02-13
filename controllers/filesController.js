const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const upload = require("../config/multer");

// Prisma client initialization
const prisma = new PrismaClient();

// POST middlewares
module.exports.uploadFile = [
  upload.single("file"),
  async (req, res, next) => {
    const uploadTime = new Date();
    const { folderId } = req.params;
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
    console.log(req.file);
    res.redirect("/");
  },
];

module.exports.downloadFile = async (req, res, next) => {
  const { fileId } = req.params;
  const fileToDownload = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
    },
  });
  //console.log(fileToDownload);
  res.download(`uploads/${fileToDownload.file}`);
};
