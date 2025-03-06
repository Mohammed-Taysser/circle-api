type Reactions = 'like' | 'love' | 'star' | 'wow';

interface Reaction extends MongoDocument {
  react: Reactions;
  post: Post;
  user: User;
}
