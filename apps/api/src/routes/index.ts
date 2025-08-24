
import { Router } from 'express';

import { authRouter } from './auth';
import { campaignsRouter } from './campaigns';
import { subscribersRouter } from './subscribers';
import { usersRouter } from './users';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/campaigns', campaignsRouter);
apiRouter.use('/subscribers', subscribersRouter);
apiRouter.use('/users', usersRouter);