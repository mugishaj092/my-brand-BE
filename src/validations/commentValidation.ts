import { NextFunction, Request, Response } from 'express';
import joi from 'joi'

export const commentsValidationSchema = joi.object({
    comment: joi.string().required().max(1000).min(3).trim().message('Please enter a valid comment'),
});

const validateComments = async (req:Request, res:Response, next:NextFunction) => {
    const value = commentsValidationSchema.validate(req.body, { abortEarly: false });
    if (value.error) {
        return res.status(403).send({message:"Invalid comments details"});
    } else {
        next();
    }
};
export default validateComments