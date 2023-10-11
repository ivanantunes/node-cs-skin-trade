import { zDatabaseController, zWebService, zLoggerUtil } from 'zmodule-api';
import { account, site, purchase_and_sales, transaction_history } from './database';
import { switchMap, tap } from 'rxjs';

const tables = [ account, site, purchase_and_sales, transaction_history ];

zDatabaseController.getInstance().createTables(tables).pipe(
    switchMap(() => zWebService.getInstance().startWebService()),
    tap((app) => {
        // TODO: Add Routers
    })
).subscribe({
    complete: () => zLoggerUtil.info({}, 'Application is Running'),
    error: (error) => zLoggerUtil.error(error, 'Failed Start Application'),
});

