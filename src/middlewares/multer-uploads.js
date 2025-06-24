import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import { v4 as uuidv4 } from "uuid";

import cloudinary from "../../configs/cloudinary.js";

const sanitizeFileName = (originalname) => {
  const fileExtension = extname(originalname);
  const rawName = originalname.split(fileExtension)[0];
  return rawName.replace(/[^a-zA-Z0-9-_]/g, "-");
};

const createCloudinaryStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder,
    public_id: (req, file) => `${sanitizeFileName(file.originalname)}-${Date.now()}`,
  },
});

export const uploadProfilePicture = multer({
  storage: createCloudinaryStorage('profiles'),
  fileFilter: (req, file, cb) => cb(null, true),
  limits: { fileSize: 10 * 1024 * 1024 }
});

