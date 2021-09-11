import express from 'express';
import createHttpError from 'http-errors';

const router = express.Router();

import { loginSchema } from '../helpers/schema-validation/loginV';
import { User } from '../models/user';
import { signAccessToken, signRefreshToken } from '@nawedtickets/common';

router.post('/api/users/signin', async (req, res, next) => {
  try {
    console.log('Hey there!!!!!!!!!!!');
    const result = await loginSchema.validateAsync(req.body);

    const existingUser = await User.findOne({ email: result.email });
    if (!existingUser) {
      throw new createHttpError.NotFound(
        `Account with ${result.email} not found, please signup first`
      );
    }

    const checkPassword = await existingUser.isValidPassword(result.password);

    if (!checkPassword) {
      throw new createHttpError.Unauthorized('Invalid credentials entered');
    }

    const accessToken = await signAccessToken(existingUser);
    const refreshToken = await signRefreshToken(existingUser);

    req.session = { jwt: accessToken, refresh: refreshToken };

    res.json({
      message: 'Log in success',
      existingUser,
    });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as signinRouter };
