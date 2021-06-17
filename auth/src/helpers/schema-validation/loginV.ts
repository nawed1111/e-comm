import joi from 'joi';

export const loginSchema = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.string().required().min(6),
});
