import express from 'express';

const router = express.Router();

import { authorization } from '@nawedtickets/common';

router.get('/api/users/currentUser', authorization, (req, res) => {
  res.send({ user: req.currentUser || null });
});

export { router as currentUserRouter };
