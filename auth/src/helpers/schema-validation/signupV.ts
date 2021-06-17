import joi from 'joi';

const signupSchema = joi.object({
  fname: joi.string().required(),
  lname: joi.string().required(),
  email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: joi.string().required().min(6).max(12),
});

export default signupSchema;
