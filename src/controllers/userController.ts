import { Request, Response } from 'express';
import Users from '../models/userModel';

exports.GetAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const User = await Users.find();
    res.status(200).json({
      status: 'success',
      results: User.length,
      data: {
        User,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.GetSingleUser = async (req: Request, res: Response) => {
  try {
    const User = await Users.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        User,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }
};

exports.UpdateUser = async (req: Request, res: Response) => {
  try {
    const User = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(req?.file?.path){
        await Users.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
    }
    res.status(200).json({
      status: 'success',
      data: {
        User,
      },
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.DeleteUser = async (req: Request, res: Response) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
