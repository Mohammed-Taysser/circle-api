import multer from 'multer';
import path from 'path';

type MulterTypes = 'user' | 'group';

const multerUpload = (type: MulterTypes) =>
  multer({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    dest: `./public/uploads/${type}`,

    fileFilter: (_request, file, callback) => {
      const ext = path.extname(file.originalname);

      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
        return;
      }
      callback(null, true);
    },
  });

export default multerUpload;
