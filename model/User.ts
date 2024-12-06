import mongoose, { Schema, Document, Model } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  hero: string;
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    hero: {
      type: String,
    
    },
  },
  { timestamps: true }
);

const User: Model<User> = mongoose.model<User>("User", userSchema);

export default User;
