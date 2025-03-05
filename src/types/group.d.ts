type Visibility = 'public' | 'private';

interface Group extends MongoDocument {
  _id: string;
  name: string;
  visibility: Visibility;
  cover: string;
  avatar: string;
  badges: Badge[];
}
