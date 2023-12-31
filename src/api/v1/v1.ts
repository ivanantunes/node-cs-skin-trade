import express from 'express';
import { AccountRouter, AuthenticationRouter, PurchaseAndSalesRouter, SiteRouter } from './routers';

export const v1 = express.Router();

v1.use('/authentication', AuthenticationRouter);
v1.use('/account', AccountRouter);
v1.use('/site', SiteRouter);
v1.use('/purchase-and-sales', PurchaseAndSalesRouter);
