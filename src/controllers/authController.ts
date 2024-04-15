import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import sendEmail from '../utils/email';
import crypto from 'crypto';

export interface AuthenticatedRequest extends Request {
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
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { email, password }: any = req.body;

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
  const token = jwt.sign({ id: Login_User }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  const jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRESIN
    ? parseInt(process.env.JWT_COOKIE_EXPIRESIN, 10)
    : undefined;
  if (jwtCookieExpiresIn !== undefined) {
    const tokenExpiration = new Date(
      Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000,
    );
    console.log(tokenExpiration);
    res.cookie('jwt', token, {
      expires: tokenExpiration,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
    });
  } else {
    console.error('JWT_COOKIE_EXPIRESIN is not defined.');
  }

  const decoded: any = await promisify<string, string>(jwt.verify)(
    token,
    process.env.JWT_SECRET || '',
  );
  const user = await User.findById(decoded.id);
  res.status(200).json({
    status: 'success',
    token: token,
    user,
  });
};

export const protect = async (
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logined in. Please login',
    });
    console.log(res);
  }
  try {
    const decoded: any = await promisify<string, string>(jwt.verify)(
      token,
      process.env.JWT_SECRET || '',
    );
    const currentUser = await User.findById(decoded.id);

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

export const currentUser = (req: AuthenticatedRequest, res: Response) => {
  return req.user;
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
      message: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333333;">Password Reset for Your <span style="font-weight: 700;"></span> Account</h1>
          <p style="color: #555555;">Dear ${user.email},</p>
          <p style="color: #555555;">I hope this email finds you well. It has come to our attention that you may be experiencing difficulty accessing your My brand Platform account. If you have forgotten your password or are having trouble logging in, we're here to help!</p>
          <p style="color: #555555;">To reset your password and regain access to your account, please follow the link below:</p>
          <p><a href="${resetURL}" style="color: #007bff; text-decoration: none;">Password Reset Link</a></p>
          <p style="color: #555555;">If you continue to experience issues or have any concerns, feel free to reach out to our support team at <a href="mailto:mugishajoseph092@gmail.com" style="color: #007bff; text-decoration: none;">mugishajoseph092@gmail.com</a>.</p>
          <p style="color: #555555;">Thank you for using My brand. We appreciate your prompt attention to this matter.</p>
          <p>Best regards,<br>Support Team</p>
          <p>mybrand@gmail.com</p>
      </div>
  </body>
  `,
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
