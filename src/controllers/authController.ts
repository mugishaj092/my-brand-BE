import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import sendEmail from '../utils/email';
import crypto from 'crypto';

interface AuthenticatedRequest extends Request {
  user?: any;
}

exports.signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || '', {
      expiresIn: process.env.JWT_EXPIRESIN,
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        User: newUser,
      },
    });
  } catch (err:any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: any = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Enter email and password',
    });
  }

  const Login_User = await User.findOne({ email }).select('+password');

  if (
    !Login_User ||
    !(await Login_User.correctPassword(password, Login_User.password))
  ) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect password or email',
    });
  }
  const token = jwt.sign({ id: Login_User._id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  res.status(200).json({
    status: 'success',
    token: token,
  });
};

exports.protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logined in. Please login',
    });
  }
  try {
    const decoded: any = await promisify<string, string>(jwt.verify)(
      token,
      process.env.JWT_SECRET || '',
    );
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message:
          'The user belonging to this token does no longer exist. Please login',
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token || Your token has expired! Please log in again.',
    });
  }
};

exports.restrictTo = (roles: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === roles) {
      next();
    } else {
      return res.status(403).json({
        status: 'fail',
        message: 'Login As An Administrator',
      });
    }
  };
};
// Import your sendEmail function

exports.forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please enter your email',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: `There is no user with this email: ${email}`,
      });
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL: string = `${req.protocol}://${req.get(
      'host',
    )}/api/users/resetPassword/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message: `Please click on the following link to reset your password: ${resetURL}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
exports.resetPassword = async (req: Request, res: Response) => {
  const currentDate = new Date();
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: currentDate },
  });
  console.log(user, hashedToken);

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid or expired token',
    });
  }
  const { password, confirmPassword }: any = req.body;
  if (!password || !confirmPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password and confirmPassword are required fields',
    });
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
    token: token,
  });
};
