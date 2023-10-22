import express from 'express';
import { Authentication } from '../../../middlewares';
import { zConfigModule, zCrudService, zDatabaseService, zTranslateService } from 'zmodule-api';
import { exitWith200, exitWith201, exitWith401, exitWith500 } from '../../../utils';
import { from, map, switchMap } from 'rxjs';
import { Op } from 'sequelize';

const translate = zTranslateService.getInstance();
const crud = zCrudService.getInstance();
const database = zDatabaseService.getInstance();

export const SiteRouter = express.Router();

SiteRouter.post('', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;

    if (!body.title || !body.url || body.sales_commission_percent < 0 || body.fee_withdraw_percent < 0 || body.opening_balance < 0 || body.balance < 0 || body.account_id < 0) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    const datetime = new Date().toISOString();

    const object = {
        ...body,
        datetime_create: datetime,
        datetime_update: datetime
    };

    crud.create(object, 'site').subscribe({
        complete: () => exitWith201(response, 'Site Registred Successfully'),
        error: (error) => exitWith500(response, 'Failed to Register Site', error)
    });
});

SiteRouter.put('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;
    const id = request.params.id;

    if (!body.title || !body.url || body.sales_commission_percent < 0 || body.fee_withdraw_percent < 0 || body.opening_balance < 0 || body.balance < 0 || body.account_id < 0) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    const object = {
        ...body,
        datetime_update: new Date().toISOString()
    };

    crud.update(object, Number(id), 'id', 'site').subscribe({
        complete: () => exitWith200(response, 'Site Updated Successfully'),
        error: (error) => exitWith500(response, 'Failed to Update Site', error)
    });
});

SiteRouter.delete('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const id = request.params.id;

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    crud.delete(Number(id), 'id', 'site').subscribe({
        complete: () => exitWith200(response, 'Site Deleted Successfully'),
        error: (error) => exitWith500(response, 'Failed to Delete Site', error)
    });
});

SiteRouter.get('', Authentication, (request, response) => {
    const query = request.query as any;
    const page = query.start ? Number(query.start) : 0;
    const pageSize = Number(query.length) || 10;
    const search =  query.search ? query.search.value : '';
    let order = { field: 'id', dir: 'asc' };

    if (query.order) {
        const temp = query.order[0];
        const column = query.columns[temp.column];

        order = { field: column.data, dir: temp.dir };
    }

    database.getConnection().pipe(
        switchMap((con) => {
            return from(con.model('site').findAndCountAll({
                where: {
                    [Op.or]: {
                        title: {
                            [Op.substring]: search
                        }
                    }
                },
                include: [
                    { as: 'account', model: con.model('account'), required: true }
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
        error: (error) => exitWith500(response, 'Failed to List Site', error)
    });
});


SiteRouter.get('/all', Authentication, (request, response) => {
    database.getConnection().pipe(
        switchMap((con) => {
            return from(con.model('site').findAll({
                attributes: ['id', 'title']
            }));
        }),
    ).subscribe({
        next: (result) => response.status(200).json(result),
        error: (error) => exitWith500(response, 'Failed to List Site', error)
    });
});

SiteRouter.get('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const id = request.params.id;

    database.getConnection().pipe(
        switchMap((con) => {
            return from(con.model('site').findOne({
                where: { id },
                include: [
                    { as: 'account', model: con.model('account'), required: true }
                ],
            }));
        })
    ).subscribe({
        next: (result) => response.status(200).json(result),
        error: (error) => exitWith500(response, 'Failed to Get Site', error)
    });
});
