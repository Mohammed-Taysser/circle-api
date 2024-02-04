import mongoose from 'mongoose';
import { User } from './user';

interface Event {
  _id: string;
  title: string;
  body: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  allDay: boolean;
  user: User;
}

type IEvent = mongoose.Document & Event;
