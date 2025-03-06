type Visibility = 'public' | 'friends' | 'private';

type Variant =
  | 'cover'
  | 'avatar'
  | 'blog'
  | 'gallery'
  | 'video'
  | 'audio'
  | 'youtube'
  | 'group'
  | 'friend'
  | 'share';

interface Post extends MongoDocument {
  visibility: Visibility;
  variant: Variant;
  user: User;
  assets: PostAsset[];
  activity?: string;
  body: string;
  comments: number;
  reactions: Reaction[];
  share: {
    count: number;
    origin?: Post;
  };
}
