import { v2 as cloudinary } from 'cloudinary';
import { MFile } from 'types/app';
import CONFIG from '../core/config';

cloudinary.config({
  cloud_name: CONFIG.cloudinary.cloudName,
  api_key: CONFIG.cloudinary.apiKey,
  api_secret: CONFIG.cloudinary.apiSecret,
});

function extractPathFromCloudinaryURL(url: string): string | null {
  const match = RegExp(/(?:\/v\d+\/)(.+)$/).exec(url);

  if (match?.[1]) {
    return match[1].replace(/\.\w+$/, '');
  }

  return null;
}

async function destroyer(url: string) {
  const id = extractPathFromCloudinaryURL(url);

  if (id) {
    cloudinary.uploader.destroy(id);
  }
}

const uploadUserAvatar = async (avatar: MFile[], oldAvatar: string) => {
  if (oldAvatar) {
    await destroyer(oldAvatar);
  }

  const uploadedAvatar = await cloudinary.uploader.upload(avatar[0].path, {
    folder: `circle/users/avatar`,
    resource_type: 'image',
  });

  return uploadedAvatar.secure_url;
};

const uploadUserCover = async (cover: MFile[], oldCover: string) => {
  if (oldCover) {
    await destroyer(oldCover);
  }

  const uploadedCover = await cloudinary.uploader.upload(cover[0].path, {
    folder: `circle/users/cover`,
    resource_type: 'image',
  });

  return uploadedCover.secure_url;
};

const uploadBadgePicture = async (picture: MFile, oldPicture?: string) => {
  if (oldPicture) {
    await destroyer(oldPicture);
  }

  const uploadedPicture = await cloudinary.uploader.upload(picture.path, {
    folder: `circle/badges/pictures`,
    resource_type: 'image',
  });

  return uploadedPicture.secure_url;
};

const uploadGroupAvatar = async (avatar: MFile[], oldAvatar?: string) => {
  if (oldAvatar) {
    await destroyer(oldAvatar);
  }

  const uploadedAvatar = await cloudinary.uploader.upload(avatar[0].path, {
    folder: `circle/groups/avatar`,
    resource_type: 'image',
  });

  return uploadedAvatar.secure_url;
};

const uploadGroupCover = async (cover: MFile[], oldCover?: string) => {
  if (oldCover) {
    await destroyer(oldCover);
  }

  const uploadedCover = await cloudinary.uploader.upload(cover[0].path, {
    folder: `circle/groups/cover`,
    resource_type: 'image',
  });

  return uploadedCover.secure_url;
};

export default {
  users: {
    uploadCover: uploadUserCover,
    uploadAvatar: uploadUserAvatar,
  },
  badges: {
    uploadPicture: uploadBadgePicture,
  },
  groups: {
    uploadCover: uploadGroupCover,
    uploadAvatar: uploadGroupAvatar,
  },
};
