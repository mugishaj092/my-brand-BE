import { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  confirmPassword: string;
  passwordChangedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createResetPasswordToken(): string;
}

const passwordValidator = function(this: IUser, el: string): boolean {
  return el === this.password;
};

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    unique: false,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
    minlength: 8,
  },
  photo: {
    type: String,
    default:
      'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: { type: String, required: [true, 'Password is required'] },
  confirmPassword: {
    type: String,
    required: [true, 'Please Confirm Password'],
    validate: {
      validator: passwordValidator,
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
