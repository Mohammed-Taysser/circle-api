import mongoose, { Schema } from 'mongoose';

const assetSchema = new Schema<PostAsset>(
  {
    type: {
      type: String,
      enum: [
        'friend',
        'group',
        'cover',
        'avatar',
        'gallery',
        'video',
        'audio',
        'youtube',
      ],
      required: true,
    },
    url: {
      type: String, // Used for media (cover, avatar, gallery, video, audio, youtube)
      trim: true,
      default: '',
    },
    refId: {
      type: Schema.Types.ObjectId, // Used for friend & group reference
      refPath: 'refModel', // Dynamic reference based on `type`
    },
    refModel: {
      type: String,
      enum: ['User', 'Group'], // Defines which model `refId` refers to
    },
    metadata: {
      width: Number, // Image/video width
      height: Number, // Image/video height
      duration: Number, // Audio/video duration
      format: String, // File format (jpg, png, mp4, etc.)
      size: Number, // File size in bytes
    },
  },
  { timestamps: true }
);

export default mongoose.model<PostAsset>('PostAsset', assetSchema);
