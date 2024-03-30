import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  date: Date;
}

const messageSchema: Schema<IMessage> = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel: Model<IMessage> = mongoose.model('Messages', messageSchema);

export default MessageModel;
