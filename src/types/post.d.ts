type Visibility = 'public' | 'friends' | 'private';

type Reactions = 'like' | 'love' | 'star' | 'wow';

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

interface Comment extends MongoDocument {
  body: string;
  user: User;
  post: Post;
}

interface Reaction extends MongoDocument {
  react: Reactions;
  post: Post;
  user: User;
}

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
