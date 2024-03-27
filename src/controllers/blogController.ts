import { Request, Response } from 'express';
import Blog from '../models/blogsModal';
import multer, { FileFilterCallback } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: 'dhforyx1s',
  api_key: '577771784241754',
  api_secret: 'nWNOam5NoSZsVq_E4ySFfFZ12fk',
  secure: true,
});

export const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb: FileFilterCallback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return "Unsupported file type!'";
    }
    cb(null, true);
  },
});

exports.CreateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await cloudinary.uploader.upload(req?.file?.path || '');
    const newBlog = await Blog.create({
      cover: result.secure_url,
      title: req.body.title,
      content: req.body.content,
    });

    res.status(201).json({
      status: 'success',
      data: {
        Blog: newBlog,
      },
    });
  } catch (err:any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const UpdateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;
  try {
    console.log('Updating blog');

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ message: 'Blog is not found' });
      return;
    }

    if (req.body.title) blog.title = req.body.title;
    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path);
      blog.cover = result.secure_url;
    }
    if (req.body.content) blog.content = req.body.content;

    await blog.save();
    res.status(200).json({ message: 'Blog updated!', Blog: blog });
  } catch (err) {
    res.status(400).json({ error: err, message: "Blog can't be updated" });
  }
};
export const DeleteBlog = async (req: Request, res: Response) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err:any) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
export const GetAllBlogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        Blogs: blogs,
      },
    });
  } catch (err:any) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
