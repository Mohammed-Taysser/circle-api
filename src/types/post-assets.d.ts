interface PostAsset extends MongoDocument {
  type:
    | 'friend'
    | 'group'
    | 'cover'
    | 'avatar'
    | 'gallery'
    | 'video'
    | 'audio'
    | 'youtube';
  url?: string; // Used for media assets (cover, avatar, gallery, video, audio, youtube)
  refId?: Types.ObjectId; // Used for relational assets (friend, group)
  refModel?: 'User' | 'Group'; // Specifies the referenced model (if applicable)
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    duration?: number; // Only for audio/video assets
  };
}
