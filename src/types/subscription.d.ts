interface Subscription extends MongoDocument {
  email: string;
  isVerified: boolean;
}
