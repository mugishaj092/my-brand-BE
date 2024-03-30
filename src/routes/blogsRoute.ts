import express from 'express';
import { addLike, unlike, upload } from '../controllers/blogController';
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
router.route('/').get(blogController.GetAllBlogs);
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
router.post('/:id/addlike', authController.protect, addLike);
router.post('/:id/unlike', authController.protect, unlike);

export default router;
