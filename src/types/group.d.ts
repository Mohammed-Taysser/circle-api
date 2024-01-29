import mongoose from 'mongoose';

type Visibility = 'public' | 'private';

interface Group {
  _id: string;
  name: string;
  visibility: Visibility;
  cover: string;
  avatar: string;
}

type IGroup = mongoose.Document & Group;
