import joi from 'joi';

export const orderSchemaValidator = joi.object({
  ticketId: joi.string().required().min(24),
});
