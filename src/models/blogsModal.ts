import mongoose, { Document, Schema } from "mongoose";

export interface BlogModel extends Document {
  title: string;
  cover: string;
  content: string;
  likes: number;
  author: String;
  Comments: String;
  createdAt: Date;
}

const blogSchema = new Schema<BlogModel>({
  title: {
    type: String,
    required: [true, "Blog title is required"],
  },
  cover: {
    type: String,
  },
  content: {
    type: String,
    required: [true, "Blog content is required"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  author: { type: String },
  Comment: {
    type: String,
  },
  CreateAt: {
    type: Date,
    default: new Date(),
  },
});

const Blog = mongoose.model<BlogModel>("Blog", blogSchema);
export default Blog;
