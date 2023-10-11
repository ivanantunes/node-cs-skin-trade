import { zEFieldTypeDB, zITableDB } from 'zmodule-api';

export const account: zITableDB = {
    tableName: 'account',
    tableFields: [
        {
            fieldName: 'id',
            fieldPrimaryKey: true,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: true
        },
        {
            fieldName: 'name',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 80
        },
        {
            fieldName: 'url',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 255,
        }
    ]
};
