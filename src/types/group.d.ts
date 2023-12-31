import mongoose from 'mongoose';

type GroupVisibility = 'public' | 'private';

interface Group {
  _id: string;
  name: string;
  visibility: GroupVisibility;
  cover: string;
  avatar: string;
}

export interface GroupSaveBody {
  name: string;
  visibility: GroupVisibility;
  cover: string;
  avatar: string;
}
export type GroupUpdateBody = Partial<Group>;

export type SavedGroupDocument = mongoose.Document & Group;
