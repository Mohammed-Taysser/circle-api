import dayjs from 'dayjs';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { AuthenticatedRequest } from 'types/app';

// File size limits
const FILE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
  audio: 10 * 1024 * 1024, // 10MB
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

/**
 * Creates a multer upload instance with custom validation and limits.
 *
 * @param {string} type - The type of upload (e.g., 'image', 'video', 'audio').
 * @returns {multer.Multer} Multer instance for handling file uploads.
 */
const createMulterUpload = (type: keyof typeof FILE_LIMITS) => {
  return multer({
    storage: multer.memoryStorage(), // Store in memory for further processing
    limits: {
      fileSize: FILE_LIMITS[type] || FILE_LIMITS.image, // Set appropriate file size limit
    },
    fileFilter: (req, file, callback) => {
      if (!ALLOWED_MIME_TYPES[type]?.includes(file.mimetype)) {
        return callback(
          new Error(`Invalid file type. Only ${type} files are allowed.`)
        );
      }
      callback(null, true);
    },
  });
};

type UploadType = 'avatar' | 'cover' | 'event' | 'badge';
type EntityType = 'users' | 'groups' | 'events' | 'badges';

async function uploadImage(
  file: Express.Multer.File,
  entityType: EntityType,
  entityId: string,
  uploadType: UploadType
) {
  if (!file) throw new Error('No file provided');

  const formattedTime = dayjs().format('HH-mm-ss');
  const extension = 'png';
  const fileName = `${formattedTime}.${extension}`;
  const today = dayjs().format('YYYY-MM-DD');

  // Determine the upload directory
  const uploadPath = path.join(
    __dirname,
    '../../public/uploads',
    entityType,
    uploadType,
    today,
    entityId
  );

  // Ensure the directory exists
  await fs.promises.mkdir(uploadPath, { recursive: true });

  // Full file path
  const filePath = path.join(uploadPath, fileName);

  // Image size configurations
  const sizes = {
    avatar: { width: 100, height: 100 },
    cover: { width: 1200, height: 400 },
    event: { width: 800, height: 600 },
    badge: { width: 150, height: 150 },
  };

  // Process and save the image
  await sharp(file.buffer)
    .resize(sizes[uploadType].width, sizes[uploadType].height)
    .toFormat('png')
    .png({ quality: 70 })
    .toFile(filePath);

  // Return relative path for storage in DB
  return path.join(
    'uploads',
    entityType,
    uploadType,
    today,
    entityId,
    fileName
  );
}

async function uploadUserOrGroupImage(
  request: AuthenticatedRequest,
  entityType: 'users' | 'groups',
  imageType: 'avatar' | 'cover'
): Promise<string | null> {
  if (
    !request.files ||
    Array.isArray(request.files) || // Ensure request.files is an object
    !Array.isArray(request.files[imageType]) ||
    !request.files[imageType][0]
  ) {
    return null;
  }

  const file = request.files[imageType][0];

  return await uploadImage(
    file,
    entityType,
    String(request.user._id),
    imageType
  );
}

export { createMulterUpload, uploadImage, uploadUserOrGroupImage };
