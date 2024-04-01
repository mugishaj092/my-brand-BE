import express from "express";
import {addMessage, deleteMessage, getMessages, singleMessage} from "../controllers/messageController";
import messageValidation from "../validations/messageValidation";
const authController = require('./../controllers/authController');

const router=express.Router();
router.post("/",messageValidation, addMessage);
router.get("/",authController.protect,authController.restrictTo('admin'), getMessages);
router.get("/:id",authController.protect,authController.restrictTo('admin'), singleMessage);
router.delete("/:id",authController.protect,authController.restrictTo('admin'), deleteMessage)
export default router;