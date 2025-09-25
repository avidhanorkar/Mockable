// middleware/upload.js
import multer, { type FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file?.mimetype);


  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(
      `Error: Only pdf files are allowed! Received: ${file.mimetype}.`
    ));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;