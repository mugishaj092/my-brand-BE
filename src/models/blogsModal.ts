import mongoose, { Document, Schema } from 'mongoose';

export interface BlogModel extends Document {
  title: string;
  cover: string;
  content: string;
  likes: number;
  dislikes: number;
  numViews: number;
  user: mongoose.Types.ObjectId;
  Comments: String;
  createdAt: Date;
}

const blogSchema = new Schema<BlogModel>({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
  },
  cover: {
    type: String,
    required: [true, 'Image source is required'],
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  Comment:{
    type:String
  },
  Date:{
    type:Date,
    default: new Date()
  }
});

const Blog = mongoose.model<BlogModel>('Blog', blogSchema);
export default Blog;
