import express from 'express';
import { AuthenticationRouter } from './routers';

export const v1 = express.Router();

v1.use('/authentication', AuthenticationRouter);
