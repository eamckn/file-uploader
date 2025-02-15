const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE queries
module.exports.createUser = async (firstName, lastName, email, password) => {
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });
};

module.exports.createFolder = async (name, userId) => {
  await prisma.folder.create({
    data: {
      name,
      userId,
    },
  });
};

module.exports.createFile = async (
  fileName,
  size,
  uploadTime,
  cloudinaryUrl,
  cloudinaryId,
  folderId
) => {
  await prisma.file.create({
    data: {
      file: fileName,
      size,
      uploadTime,
      cloudinaryUrl,
      cloudinaryId,
      folderId,
    },
  });
};

// READ queries
module.exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

module.exports.getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

module.exports.getFoldersByUserId = async (userId) => {
  const folders = await prisma.folder.findMany({
    where: {
      userId,
    },
  });
  return folders;
};

module.exports.getFolderByFolderId = async (folderId) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
  });
  return folder;
};

module.exports.getFilesByFolderId = async (folderId) => {
  const files = await prisma.file.findMany({
    where: {
      folderId: Number(folderId),
    },
  });
  return files;
};

module.exports.getFileByFileId = async (fileId) => {
  const file = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
    },
  });
  return file;
};
// UPDATE queries
module.exports.updateFolder = async (id, name) => {
  await prisma.folder.update({
    where: {
      id,
    },
    data: {
      name: name,
    },
  });
};

// DELETE queries
module.exports.deleteFilesFromFolder = async (folderId) => {
  await prisma.file.deleteMany({
    where: {
      folderId: Number(folderId),
    },
  });
};

module.exports.deleteFolder = async (folderId) => {
  await this.deleteFilesFromFolder(folderId);
  await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });
};
