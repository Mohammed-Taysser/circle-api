import multer from 'multer';
import path from 'path';

// Multer config
const multerUtils = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: multer.diskStorage({}),

  fileFilter: (_request, file, callback) => {
    const ext = path.extname(file.originalname);

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
      return;
    }
    callback(null, true);
  },
});

const userUpload = multerUtils.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

export default multerUtils;
export { userUpload };
