import { Response } from 'express';
import { HttpResponse } from '../interfaces';
import { HttpCode } from '../enums';

/**
 * Creates an HTTP Code Response Object 200
 * @param response - HTTP response
 * @param description - Response Description
 * @param value - Object or Array with Custom Values
 * @returns HTTP Response Object Code 200
 */
export function exitWith200(response: Response, description: string, value?: any): Response {
    const object: HttpResponse = { code: HttpCode.OK, error: false, message: description, value };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 201
 * @param response - HTTP response
 * @param description - Response Description
 * @param value - Object or Array with Custom Values
 * @returns HTTP Response Object Code 201
 */
export function exitWith201(response: Response, description: string, value?: any): Response {
    const object: HttpResponse = { code: HttpCode.CREATE, error: false, message: description, value };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 202
 * @param response - HTTP response
 * @param description - Response Description
 * @param value - Object or Array with Custom Values
 * @returns HTTP Response Object Code 202
 */
export function exitWith202(response: Response, description: string, value?: any): Response {
    const object: HttpResponse = { code: HttpCode.ACCEPTED, error: false, message: description, value };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 400
 * @param response - HTTP response
 * @param description - Response Description
 * @returns HTTP Response Object Code 400
 */
export function exitWith400(response: Response, description: string): Response {
    const object: HttpResponse = { code: HttpCode.BAD_REQUEST, error: true, message: description };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 401
 * @param response - HTTP response
 * @param description - Response Description
 * @returns HTTP Response Object Code 401
 */
export function exitWith401(response: Response, description: string): Response {
    const object: HttpResponse = { code: HttpCode.UNAUTHORIZED, error: true, message: description };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 402
 * @param response - HTTP response
 * @param description - Response Description
 * @returns HTTP Response Object Code 402
 */
export function exitWith402(response: Response, description: string): Response {
    const object: HttpResponse = { code: HttpCode.FORBIDDEN, error: true, message: description };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 404
 * @param response - HTTP response
 * @param description - Response Description
 * @returns HTTP Response Object Code 404
 */
export function exitWith404(response: Response, description: string): Response {
    const object: HttpResponse = { code: HttpCode.NOT_FOUND, error: true, message: description };

    return response.status(object.code).json(object);
}

/**
 * Creates an HTTP Code Response Object 400
 * @param response - HTTP response
 * @param description - Response Description
 * @param log - Log do Erro Interno
 * @returns HTTP Response Object Code 400
 */
export function exitWith500(response: Response, description: string, log?: any): Response {
    const object: HttpResponse = { code: HttpCode.INTERNAL_SERVER_ERROR, error: true, message: description, value: log };

    return response.status(object.code).json(object);
}
