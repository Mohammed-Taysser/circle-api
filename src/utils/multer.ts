import dayjs from 'dayjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthenticatedRequest } from 'types/app';

type MulterTypes = 'users' | 'groups';

function multerUpload(type: MulterTypes) {
  return multer({
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        const request = req as AuthenticatedRequest;
        const today = dayjs().format('YYYY-MM-DD');
        const destination = path.resolve(
          __dirname,
          `../../public/uploads/${type}/avatar/${today}/${request.user._id}`
        );

        // Ensure the directory exists
        if (!fs.existsSync(destination)) {
          fs.mkdirSync(destination, { recursive: true });
        }

        callback(null, destination);
      },
      filename: (request, file, callback) => {
        const formattedTime = dayjs().format('HH-mm-ss');
        const extension = file.mimetype.split('/')[1];
        callback(null, `${formattedTime}.${extension}`);
      },
    }),
    fileFilter: (request, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        callback(new Error('Only images are allowed'));
        return;
      }
      callback(null, true);
    },
  });
}

export { multerUpload };
