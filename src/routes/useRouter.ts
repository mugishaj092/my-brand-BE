const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.post('/forgetpassword', authController.forgetPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.GetAllUsers
    )
router
    .route('/:id')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.GetSingleUser
    )
    .patch(authController.protect, userController.UpdateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.DeleteUser
    )

export default router
