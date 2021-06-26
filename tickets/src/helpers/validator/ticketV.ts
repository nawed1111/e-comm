import joi from 'joi';

export const ticketSchema = joi.object({
  title: joi.string().required().min(4),
  price: joi.number().required().greater(0),
});
