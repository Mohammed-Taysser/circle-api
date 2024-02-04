import { ResourceType, v2 as cloudinary } from 'cloudinary';
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

async function destroyer(url: string, type: ResourceType = 'image') {
  const id = extractPathFromCloudinaryURL(url);

  if (id) {
    await cloudinary.uploader.destroy(id, {
      resource_type: type,
    });
  }
}

const uploadUserAvatar = async (avatar: MFile[], oldAvatar: string) => {
  try {
    if (oldAvatar) {
      await destroyer(oldAvatar);
    }

    const uploadedAvatar = await cloudinary.uploader.upload(avatar[0].path, {
      folder: `circle/users/avatar`,
      resource_type: 'image',
    });

    return uploadedAvatar.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadUserCover = async (cover: MFile[], oldCover: string) => {
  try {
    if (oldCover) {
      await destroyer(oldCover);
    }

    const uploadedCover = await cloudinary.uploader.upload(cover[0].path, {
      folder: `circle/users/cover`,
      resource_type: 'image',
    });

    return uploadedCover.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadBadgePicture = async (picture: MFile, oldPicture?: string) => {
  try {
    if (oldPicture) {
      await destroyer(oldPicture);
    }

    const uploadedPicture = await cloudinary.uploader.upload(picture.path, {
      folder: `circle/badges/pictures`,
      resource_type: 'image',
    });

    return uploadedPicture.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadGroupAvatar = async (avatar: MFile[], oldAvatar?: string) => {
  try {
    if (oldAvatar) {
      await destroyer(oldAvatar);
    }

    const uploadedAvatar = await cloudinary.uploader.upload(avatar[0].path, {
      folder: `circle/groups/avatar`,
      resource_type: 'image',
    });

    return uploadedAvatar.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadGroupCover = async (cover: MFile[], oldCover?: string) => {
  try {
    if (oldCover) {
      await destroyer(oldCover);
    }

    const uploadedCover = await cloudinary.uploader.upload(cover[0].path, {
      folder: `circle/groups/cover`,
      resource_type: 'image',
    });

    return uploadedCover.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadPostVideo = async (video: MFile, oldVideo?: string) => {
  try {
    if (oldVideo) {
      await destroyer(oldVideo, 'video');
    }

    const uploadedVideo = await cloudinary.uploader.upload(video.path, {
      folder: `circle/posts/videos`,
      resource_type: 'video',
    });

    return uploadedVideo.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadPostAudio = async (audio: MFile, oldAudio?: string) => {
  try {
    if (oldAudio) {
      await destroyer(oldAudio, 'video');
    }

    const uploadedAudio = await cloudinary.uploader.upload(audio.path, {
      folder: `circle/posts/audios`,
      resource_type: 'auto',
    });

    return uploadedAudio.secure_url;
  } catch (error) {
    return '';
  }
};

const uploadPostGallery = async (
  pictures: MFile[],
  oldPictures?: string[]
): Promise<string[]> => {
  try {
    if (oldPictures && oldPictures.length > 0) {
      await Promise.all(
        oldPictures.map(async (oldPicture) => await destroyer(oldPicture))
      );
    }

    const uploadedPictures = await Promise.all(
      pictures.map(async (picture) => {
        const uploadedPicture = await cloudinary.uploader.upload(picture.path, {
          folder: `circle/posts/gallery`,
          resource_type: 'image',
        });
        return uploadedPicture.secure_url;
      })
    );

    return uploadedPictures;
  } catch (error) {
    return [];
  }
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
  posts: {
    uploadVideo: uploadPostVideo,
    uploadAudio: uploadPostAudio,
    uploadGallery: uploadPostGallery,
  },
};
