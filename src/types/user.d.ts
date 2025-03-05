interface User extends MongoDocument {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cover: string;
  email: string;
  password: string;
  badges: Badge[];
  bookmarks: Post[];
  passwordChangeAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  verified: boolean;
  status: 'active' | 'inactive' | 'banned';
  isVerified: boolean;
}
