import joi from 'joi';

export const paymentValidator = joi.object({
  token: joi.string().required().not().empty(),
  orderId: joi.string().required().min(24),
});
