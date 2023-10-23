import express from 'express';
import { Authentication } from '../../../middlewares';
import { zConfigModule, zCrudService, zDatabaseService, zTranslateService } from 'zmodule-api';
import { exitWith200, exitWith201, exitWith401, exitWith500 } from '../../../utils';
import { catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { Op } from 'sequelize';
import { purchase_and_sales, site } from '../../../database';

const translate = zTranslateService.getInstance();
const crud = zCrudService.getInstance();
const database = zDatabaseService.getInstance();

export const PurchaseAndSalesRouter = express.Router();

PurchaseAndSalesRouter.post('', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;

    if (!body.item_name || !body.item_weapon || body.item_price_on_steam < 0 || body.purchase_price < 0 || body.percent_discount_on_purchase < 0 || body.sale_value < 0 || body.percent_discount_on_sale < 0 || !body.status || !body.site_id) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    const datetime = new Date().toISOString();

    const object = {
        ...body,
        datetime_create: datetime,
        datetime_update: datetime
    };

    database.getConnection().pipe(
        switchMap((con) => from(con.transaction({ autocommit: false })).pipe(
            switchMap((transaction) => {
                return crud.findAll(site, { id: body.site_id }).pipe(
                    switchMap((sites) => {
                        if (sites.length === 0) {
                            return throwError(() => 'Site Not Found by Id');
                        }

                        const site = sites[0];

                        object.sales_commission_percent = site.sales_commission_percent;
                        object.fee_withdraw_percent = site.fee_withdraw_percent;

                        object.balance_deducting_sales_commission = object.sale_value - (object.sale_value * (site.sales_commission_percent / 100));

                        object.final_balance = object.balance_deducting_sales_commission - (object.balance_deducting_sales_commission * (site.fee_withdraw_percent / 100));

                        object.profit = object.balance_deducting_sales_commission - object.purchase_price;

                        return crud.create(object, 'purchase_and_sales', transaction).pipe(
                            map((ids) => ids[0].id),
                            switchMap((id) => {
                                const transactionHistory = {
                                    purchase_and_sales_id: id,
                                    item_price_on_steam: object.item_price_on_steam,
                                    purchase_price: object.purchase_price,
                                    percent_discount_on_purchase: object.percent_discount_on_purchase,
                                    sale_value: object.sale_value,
                                    percent_discount_on_sale: object.percent_discount_on_sale,
                                    sales_commission_percent: object.sales_commission_percent,
                                    fee_withdraw_percent: object.fee_withdraw_percent,
                                    balance_deducting_sales_commission: object.balance_deducting_sales_commission,
                                    final_balance: object.final_balance,
                                    profit: object.profit,
                                    status: object.status,
                                    datetime
                                };

                                return crud.create(transactionHistory, 'transaction_history', transaction);
                            }),
                            switchMap(() => {
                                return database.getConnection().pipe(
                                    switchMap((con) => {

                                        if (object.status === 'purchase') {
                                            return from(con.model('site').increment(
                                                { balance: Number(object.purchase_price) * -1 },
                                                { where: { id: site.id }, transaction }
                                            )).pipe(
                                                switchMap(() => crud.update({ datetime_update: new Date().toISOString() }, site.id, 'id', 'site', transaction))
                                            );
                                        } else if (object.status === 'for_sale') {
                                            return from(con.model('site').increment(
                                                { balance: +Number(object.balance_deducting_sales_commission) },
                                                { where: { id: site.id }, transaction }
                                            )).pipe(
                                                switchMap(() => crud.update({ datetime_update: new Date().toISOString() }, site.id, 'id', 'site', transaction))
                                            );
                                        }

                                        return of(-1);
                                    }),
                                );
                            }),
                            tap(() => transaction.commit()),
                            catchError((error) => {
                                transaction.rollback();
                                return throwError(() => error);
                            })
                        );
                    })
                );
            })
        ))
    ).subscribe({
        complete: () => exitWith201(response, 'Item Registred Successfully'),
        error: (error) => exitWith500(response, 'Failed to Register Item', error)
    });
});

PurchaseAndSalesRouter.put('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;
    const id = request.params.id;

    if (!body.item_name || !body.item_weapon || body.item_price_on_steam < 0 || body.purchase_price < 0 || body.percent_discount_on_purchase < 0 || body.sale_value < 0 || body.percent_discount_on_sale < 0 || !body.status || !body.site_id) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    const object = {
        ...body,
        datetime_update: new Date().toISOString()
    };

    database.getConnection().pipe(
        switchMap((con) => from(con.transaction({ autocommit: false })).pipe(
            switchMap((transaction) => {
                return crud.findAll(site, { id: body.site_id }).pipe(
                    switchMap((sites) => {
                        if (sites.length === 0) {
                            return throwError(() => 'Site Not Found by Id');
                        }

                        const site = sites[0];

                        object.sales_commission_percent = site.sales_commission_percent;
                        object.fee_withdraw_percent = site.fee_withdraw_percent;

                        object.balance_deducting_sales_commission = object.sale_value - (object.sale_value * (site.sales_commission_percent / 100));

                        object.final_balance = object.balance_deducting_sales_commission - (object.balance_deducting_sales_commission * (site.fee_withdraw_percent / 100));

                        object.profit = object.balance_deducting_sales_commission - object.purchase_price;

                        return crud.update(object, Number(id), 'id', 'purchase_and_sales', transaction).pipe(
                            switchMap(() => {
                                const transactionHistory = {
                                    purchase_and_sales_id: id,
                                    item_price_on_steam: object.item_price_on_steam,
                                    purchase_price: object.purchase_price,
                                    percent_discount_on_purchase: object.percent_discount_on_purchase,
                                    sale_value: object.sale_value,
                                    percent_discount_on_sale: object.percent_discount_on_sale,
                                    sales_commission_percent: object.sales_commission_percent,
                                    fee_withdraw_percent: object.fee_withdraw_percent,
                                    balance_deducting_sales_commission: object.balance_deducting_sales_commission,
                                    final_balance: object.final_balance,
                                    profit: object.profit,
                                    status: object.status,
                                    datetime: object.datetime_update
                                };

                                return crud.create(transactionHistory, 'transaction_history', transaction);
                            }),
                            switchMap(() => {
                                return database.getConnection().pipe(
                                    switchMap((con) => {

                                        if (object.status === 'purchase') {
                                            return from(con.model('site').increment(
                                                { balance: Number(object.purchase_price) * -1 },
                                                { where: { id: site.id }, transaction }
                                            )).pipe(
                                                switchMap(() => crud.update({ datetime_update: new Date().toISOString() }, site.id, 'id', 'site', transaction))
                                            );
                                        } else if (object.status === 'for_sale') {
                                            return from(con.model('site').increment(
                                                { balance: +Number(object.balance_deducting_sales_commission) },
                                                { where: { id: site.id }, transaction }
                                            )).pipe(
                                                switchMap(() => crud.update({ datetime_update: new Date().toISOString() }, site.id, 'id', 'site', transaction))
                                            );
                                        }

                                        return of(-1);
                                    }),
                                );
                            }),
                            tap(() => transaction.commit()),
                            catchError((error) => {
                                transaction.rollback();
                                return throwError(() => error);
                            })
                        );
                    })
                );
            })
        ))
    ).subscribe({
        complete: () => exitWith201(response, 'Item Updated Successfully'),
        error: (error) => exitWith500(response, 'Failed to Update Item', error)
    });
});

PurchaseAndSalesRouter.delete('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const id = request.params.id;

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    database.getConnection().pipe(
        switchMap((con) => from(con.transaction({ autocommit: false })).pipe(
            switchMap((transaction) => {
                return from(con.model('purchase_and_sales').findOne({
                    where: { id },
                    include: [
                        { as: 'site', model: con.model('site'), required: true }
                    ],
                    transaction
                })).pipe(
                    switchMap((rawItem) => {
                        if (!rawItem) {
                            return throwError(() => 'Item Not Found');
                        }

                        const item = rawItem.get({ plain: true });

                        return from(con.model('site').increment(
                            { balance: item.status === 'for_sale' ? Number(item.profit) * -1 : +Number(item.purchase_price) },
                            { where: { id: item.site_id }, transaction }
                        )).pipe(
                            switchMap(() => crud.update({ datetime_update: new Date().toISOString() }, item.site_id, 'id', 'site', transaction))
                        );
                    }),
                    switchMap(() => crud.delete(Number(id), 'id', 'purchase_and_sales', false, transaction)),
                    tap(() => transaction.commit()),
                    catchError((error) => {
                        transaction.rollback();
                        return throwError(() => error);
                    })
                );
            })
        ))
    ).subscribe({
        complete: () => exitWith200(response, 'Item Deleted Successfully'),
        error: (error) => exitWith500(response, 'Failed to Delete Item', error)
    });
});

PurchaseAndSalesRouter.get('', Authentication, (request, response) => {
    const query = request.query as any;
    const page = query.start ? Number(query.start) : 0;
    const pageSize = Number(query.length) || 10;
    const search = query.search ? query.search.value : '';
    let order = { field: 'id', dir: 'asc' };

    if (query.order) {
        const temp = query.order[0];
        const column = query.columns[temp.column];

        order = { field: column.data || 'id', dir: temp.dir };
    }

    database.getConnection().pipe(
        switchMap((con) => {
            return from(con.model('purchase_and_sales').findAndCountAll({
                where: {
                    [Op.or]: {
                        item_name: {
                            [Op.substring]: search
                        },
                    }
                },
                include: [
                    {
                        as: 'site',
                        model: con.model('site'),
                        required: true,
                        include: [
                            { as: 'account', model: con.model('account'), required: true }
                        ]
                    },
                ],
                limit: pageSize,
                offset: page,
                order: [[order.field, order.dir]]
            }));
        }),
        map((result) => {
            const rows = result.rows.map((row) => row.get({ plain: true }));
            const total = result.count;

            return { draw: query.draw, recordsTotal: total, recordsFiltered: total, data: rows };
        })
    ).subscribe({
        next: (result) => response.status(200).json(result),
        error: (error) => exitWith500(response, 'Failed to List Item', error)
    });
});

PurchaseAndSalesRouter.get('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const id = request.params.id;

    database.getConnection().pipe(
        switchMap((con) => {
            return from(con.model('purchase_and_sales').findOne({
                where: { id },
                include: [
                    {
                        as: 'site',
                        model: con.model('site'),
                        required: true,
                        include: [
                            { as: 'account', model: con.model('account'), required: true }
                        ]
                    },
                ],
            }));
        })
    ).subscribe({
        next: (result) => response.status(200).json(result),
        error: (error) => exitWith500(response, 'Failed to Get Item', error)
    });
});
