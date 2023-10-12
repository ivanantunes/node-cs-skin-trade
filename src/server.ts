import { zDatabaseController, zWebService, zLoggerUtil } from 'zmodule-api';
import { account, site, purchase_and_sales, transaction_history } from './database';
import { switchMap, tap } from 'rxjs';
import path from 'path';
import express from 'express';

const tables = [ account, site, purchase_and_sales, transaction_history ];

zDatabaseController.getInstance().createTables(tables).pipe(
    switchMap(() => zWebService.getInstance().startWebService()),
    tap((app) => {
        // TODO: Add Routers
        app.use('', express.static(path.join(__dirname, '..', 'app/pages')));
        app.use('/', express.static(path.join(__dirname, '..', 'app/pages')));
        app.use('/web/libs', express.static(path.join(__dirname, '..', 'app/libs')));
        app.use('/web/assets', express.static(path.join(__dirname, '..', 'app/assets')));
        app.use('/web/scripts', express.static(path.join(__dirname, '..', 'app/scripts')));
    })
).subscribe({
    complete: () => zLoggerUtil.info({}, 'Application is Running'),
    error: (error) => zLoggerUtil.error(error, 'Failed Start Application'),
});

