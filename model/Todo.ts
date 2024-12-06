import mongoose, { Schema, Document, Model } from "mongoose";

interface Todo extends Document {
  title: string;
  desc: string;
  message: string;
  skills: string[];
  type: string;
  priority: string;
  userId:string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
    //   enum:["css","javascript","node.js","react.js","express","mongodb"]
    },
    type: {
      type: String,
      enum:["frontend","backend"]
    },
    priority: {
        type: String,
        enum:["low","medium","high"]
      },
  },
  { timestamps: true }
);

const Todo = mongoose.model<Todo>("Todo", userSchema);

export default Todo;
