import express from 'express';

const router = express.Router();

import { authorization } from '../middlewares/auth-middleware';

router.get('/api/users/currentUser', authorization, (req, res) => {
  res.send({ user: req.currentUser });
});

export { router as currentUserRouter };
