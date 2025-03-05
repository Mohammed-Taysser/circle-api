interface Event extends MongoDocument {
  title: string;
  body: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  user: User;
  attendees: User[];
}
