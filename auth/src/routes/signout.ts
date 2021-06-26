import express from 'express';

const router = express.Router();

import { authorization } from '@nawedtickets/common';

router.post('/api/users/signout', authorization, (req, res) => {
  req.session = null;

  res.send({
    message: 'Sign out success',
  });
});

export { router as signoutRouter };
