import express from 'express';
import createHttpError from 'http-errors';

const router = express.Router();

import signupSchema from '../helpers/schema-validation/signupV';
import { User } from '../models/user';
import { signAccessToken, signRefreshToken } from '@nawedtickets/common';

router.post('/api/users/signup', async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);

    const userExists = await User.findOne({ email: result.email });
    if (userExists) {
      throw new createHttpError.Conflict(
        `Account with ${result.email} already exists`
      );
    }
    const newuser = await User.build(result).save();

    const accessToken = await signAccessToken(newuser);
    const refreshToken = await signRefreshToken(newuser);

    req.session = { jwt: accessToken, refresh: refreshToken };

    res.status(201).json({
      message: 'user created',
      newuser,
    });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as signupRouter };
