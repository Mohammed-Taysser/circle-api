import { Document } from 'mongoose';
import { User } from './user';

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

interface Assets {
  friend?: Friend;
  group?: Group;
  youtube?: string;
  cover?: string;
  avatar?: string;
  gallery?: string[];
  audio?: string;
  video?: string;
}

interface Comment {
  body: string;
  user: User;
  post: Post;
}

interface Reaction {
  react: Reactions;
  post: Post;
  user: User;
}

interface Post {
  _id: string;
  visibility: Visibility;
  variant: Variant;
  user: User;
  publishAt: Date;
  editAt: Date;
  assets: Assets;
  activity?: string;
  body: string;
  comments: number;
  reactions: Reaction[];
  share: {
    count: number;
    origin?: Post;
  };
}

type IPost = Post & Document;

type IComment = Comment & Document;

type IReaction = Reaction & Document;
