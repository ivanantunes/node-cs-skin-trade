import { NextFunction, Request, Response } from 'express';
import { zConfigModule, zTranslateService } from 'zmodule-api';
import jwt from 'jsonwebtoken';
import { exitWith401 } from '../utils';

const translate = zTranslateService.getInstance();

export const Authentication = (request: Request, response: Response, next: NextFunction) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;

    if (!request.headers.authorization) {
        return exitWith401(response, translate.t('Token Not Found', { lng }));
    }

    const [prefix, token] = String(request.headers.authorization).split(' ');

    if (!prefix || !token) {
        return exitWith401(response, translate.t('Invalid Token', { lng }));
    }

    if (prefix !== 'Bearer') {
        return exitWith401(response, translate.t('Ivalid Token', { lng }));
    }

    jwt.verify(token, zConfigModule.MOD_CRYPTO_PASSWORD, (error, decode: any) => {
        if (error) {
            return response.status(401).json({ code: 401, error: true, message: 'Session Expired', value: { isAuth: false } });
        }

        request.query.id = decode.email;
        request.query.lng = lng;

        next();
    });
};
