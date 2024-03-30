import { Request, Response } from 'express';
import CommentModel, { IComment } from '../models/commentModal';
import BlogModel from '../models/blogsModal';
import { AuthenticatedRequest } from './authController';

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const blog = await BlogModel.findOne({ _id: id });
    console.log(blog);
    
    const commentData: IComment = new CommentModel({
      name: req.user.name,
      picture: req.user.photo, 
      comment: req.body.comment,
      blog_id: blog?.id,
    });

    if (blog) {
      await commentData.save();
      await BlogModel.findByIdAndUpdate(id, {
        $push: { comments: commentData._id },
      });
      res.json({ message: 'Comment added!' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getComments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const blogs = await BlogModel.findOne({_id: id});
    console.log(blogs);
    if (!blogs) {
      res.status(404).send({ message: 'BBlog not found' });
      return;
    }

    const comments: IComment[] = await CommentModel.find({
      blog_id: id,
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server Error' });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, cid, type } = req.params;
    if (type === 'comment') {
      await BlogModel.findByIdAndUpdate(id, { $pull: { comments: cid } });
      await CommentModel.findByIdAndDelete(cid);
    } else {
      throw new Error('Invalid type');
    }

    res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
