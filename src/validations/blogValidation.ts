import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const createBlogValidationSchema = Joi.object({
    title: Joi.string().required().max(255),
    content: Joi.string().required().max(1000000),

});

const createBlogValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const value = createBlogValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (value.error) {
      return res.status(403).send({ message: "Invalid blog details" });
    } else {
      next();
    }
  };

  export default createBlogValidation