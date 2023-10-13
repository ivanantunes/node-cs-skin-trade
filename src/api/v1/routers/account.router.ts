import express from 'express';
import { Authentication } from '../../../middlewares';
import { zClientService, zConfigModule, zCrudService, zDatabaseService, zTranslateService } from 'zmodule-api';
import { exitWith200, exitWith201, exitWith401, exitWith500 } from '../../../utils';
import { account } from '../../../database';
import { from, map, switchMap } from 'rxjs';
import { Op } from 'sequelize';

const translate = zTranslateService.getInstance();
const crud = zCrudService.getInstance();
const database = zDatabaseService.getInstance();

export const AccountRouter = express.Router();

AccountRouter.post('', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;

    if (!body.name || !body.url) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    const datetime = new Date().toISOString();

    const object = {
        name: body.name,
        url: body.url,
        datetime_create: datetime,
        datetime_update: datetime
    };

    crud.create(object, 'account').subscribe({
        complete: () => exitWith201(response, 'Account Registred Successfully'),
        error: (error) => exitWith500(response, 'Failed to Register Account', error)
    });
});

AccountRouter.put('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;
    const id = request.params.id;

    if (!body.name || !body.url) {
        return exitWith401(response, translate.t('Missing Parameters', { lng }));
    }

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    const object = {
        name: body.name,
        url: body.url,
        datetime_update: new Date().toISOString()
    };

    crud.update(object, Number(id), 'id', 'account').subscribe({
        complete: () => exitWith200(response, 'Account Updated Successfully'),
        error: (error) => exitWith500(response, 'Failed to Update Account', error)
    });
});

AccountRouter.delete('/:id', Authentication, (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const id = request.params.id;

    if (isNaN(Number(id))) {
        return exitWith401(response, translate.t('Invalid Id', { lng }));
    }

    crud.delete(Number(id), 'id', 'account').subscribe({
        complete: () => exitWith200(response, 'Account Deleted Successfully'),
        error: (error) => exitWith500(response, 'Failed to Delete Account', error)
    });
});

AccountRouter.get('', Authentication, (request, response) => {
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
            return from(con.model('account').findAndCountAll({
                where: {
                    [Op.or]: {
                        name: {
                            [Op.substring]: search
                        }
                    }
                },
                limit: pageSize,
                offset: page * pageSize,
                order: [[order.field, order.dir]]
            }));
        }),
        map((result) => {
            const rows = result.rows.map((row) => row.get({ plain: true }));
            const total = result.count;

            return { draw: query.draw, recordsTotal: total, recordsFiltered: rows.length, data: rows };
        })
    ).subscribe({
        next: (result) => response.status(200).json(result),
        error: (error) => exitWith500(response, 'Failed to List Account', error)
    });
});

AccountRouter.get('/:id', Authentication, (request, response) => {});
