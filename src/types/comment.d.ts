interface UserComment extends MongoDocument {
  body: string;
  user: User;
  post: Post;
}
