import { v2 as cloudinary } from 'cloudinary';
import CONFIG from '../core/config';
import { CloudinaryUploaderType } from '../types/app';

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

function destroyer(path: string) {
  const ids = path.split('/');
  const id = ids
    .slice(ids.length - 4)
    .join('/')
    .split('.')[0];

  // convert
  // https://res.cloudinary.com/username/image/upload/v-id/circle/users/avatar/avatar-2.png
  // to
  // "circle/users/avatar/avatar-2.png"
  // to
  // "circle/users/avatar/avatar-2"

  return cloudinary.uploader.destroy(id);
}

function uploadAvatar(file: string, type: CloudinaryUploaderType) {
  return cloudinary.uploader.upload(file, {
    folder: `circle/${type}/avatar`,
  });
}

function uploadCover(file: string, type: CloudinaryUploaderType) {
  return cloudinary.uploader.upload(file, {
    folder: `circle/${type}/cover`,
  });
}

export default { uploadAvatar, uploadCover, destroyer };
