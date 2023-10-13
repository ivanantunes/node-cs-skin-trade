import express from 'express';
import { AccountRouter, AuthenticationRouter } from './routers';

export const v1 = express.Router();

v1.use('/authentication', AuthenticationRouter);
v1.use('/account', AccountRouter);
