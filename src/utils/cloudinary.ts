import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploaderType } from 'types/app';
import CONFIG from '../core/config';

cloudinary.config({
  cloud_name: CONFIG.cloudinary.cloudName,
  api_key: CONFIG.cloudinary.apiKey,
  api_secret: CONFIG.cloudinary.apiSecret,
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
