import express from 'express';
import { upload } from '../controllers/blogController';
const blogController = require('./../controllers/blogController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  upload.single('image'),
  blogController.CreateBlog,
);
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        blogController.GetAllBlogs
    )
router.patch(
    '/:id',
    authController.protect,
    authController.restrictTo('admin'),
    upload.single('image'),
    blogController.UpdateBlog,
  );
  router.delete(
    '/:id',
    authController.protect,
    authController.restrictTo('admin'),
    blogController.DeleteBlog,
  );

export default router;
