import express from 'express';
import { exitWith200, exitWith401, exitWith404 } from '../../../utils';
import { zConfigModule, zTranslateService } from 'zmodule-api';
import jwt from 'jsonwebtoken';

const translate = zTranslateService.getInstance();

export const AuthenticationRouter = express.Router();

AuthenticationRouter.post('/login', (request, response) => {
    const lng = request.headers['content-language'] || zConfigModule.MOD_LANG;
    const body = request.body;

    if (!body.email || !body.password) {
        return exitWith401(response, translate.t('Missing Parameters for Operation.', { lng }));
    }

    const email = body.email;
    const password = body.password;

    if (email !== process.env.USER_EMAIL) {
        return exitWith404(response, translate.t('Email Not Found, Please Try Again.', { lng }));
    }

    if (password !== process.env.USER_PASSWORD) {
        return exitWith401(response, translate.t('Invalid Password, Try Again.', { lng }));
    }

    const token = jwt.sign({ email }, zConfigModule.MOD_CRYPTO_PASSWORD, { expiresIn: '12h' });

    const object = {
        photo: null,
        username: process.env.USER_NAME || translate.t('Undefined', { lng }),
        email,
        token
    };

    return exitWith200(response, translate.t('Connection Made Successfully', { lng }), object);
});
