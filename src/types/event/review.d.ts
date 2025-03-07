interface Review extends MongoDocument {
  body: string;
  user: User;
  event: UserEvent;
  rate: number;
}
