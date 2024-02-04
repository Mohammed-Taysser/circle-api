import multer from 'multer';

// Multer config
const multerUtils = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: multer.diskStorage({}),

  fileFilter: (_request, file, callback) => {
    const allowedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'video/mp4',
      'audio/mpeg',
    ];

    if (!allowedFileTypes.includes(file.mimetype)) {
      callback(new Error('Only mpeg, mp4, jpg, jpeg and png files are allowed!'));
      return;
    }

    // 10 MB
    if (file.size > 10 * 1024 * 1024) {
      callback(new Error('File size is too large!, max 10MB allowed!'));
      return;
    }

    callback(null, true);
  },
});

const userUpload = multerUtils.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

const groupUpload = multerUtils.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

const postUpload = multerUtils.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

export default multerUtils;
export { groupUpload, postUpload, userUpload };

