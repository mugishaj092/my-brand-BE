import mongoose, { Document, Schema, Model } from "mongoose";

// Define interface for the comment document
export interface IComment extends Document {
    user_id: string;
    comment: string;
    blog_id: mongoose.Types.ObjectId;
    createdAt: Date;
    picture:string
}

// Define the schema
const commentSchema: Schema<IComment> = new Schema<IComment>({
    name: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    blog_id: {
        type: String,
        ref: "Blog", 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    picture:{
        type:String,
    }
});

const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
