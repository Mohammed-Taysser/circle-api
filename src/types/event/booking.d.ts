interface Booking extends MongoDocument {
  user: User;
  event: UserEvent;
  status: 'pending' | 'accepted' | 'rejected';
  isPaid: boolean;
  price: number;
  quantity: number;
}
