import { NextFunction, Request, Response } from 'express';
import joi from 'joi';

export const messageValidationSchema = joi.object({
  firstname: joi
    .string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Display firstname cannot be empty',
      'string.min': 'Min 6 characteers',
    })
    .optional(),
  lastname: joi
    .string()
    .min(3)
    .required()
    .messages({
      'string.empty': 'Display lastname cannot be empty',
      'string.min': 'Min 6 characteers',
    })
    .optional(),
  email: joi
    .string()
    .min(6)
    .required()
    .email()
    .messages({
      'any.only': 'Must be a valid email address',
    }),
  message: joi
    .string()
    .min(6)
    .required()
    .messages({ 'any.only': 'message is required' }),
  phone: joi
    .string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({ 'any.only': 'message is required' }),
});

const messageValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const value = messageValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (value.error) {
    return res.status(403).send({ message: 'Invalid message details' });
  } else {
    next();
  }
};
export default messageValidation;
