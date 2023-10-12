import { Sequelize } from 'sequelize';
import { zEFieldTypeDB, zITableDB } from 'zmodule-api';

export const site: zITableDB = {
    tableName: 'site',
    tableFields: [
        {
            fieldName: 'id',
            fieldPrimaryKey: true,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: true
        },
        {
            fieldName: 'logo',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldAllowNull: true,
            fieldDefaultValue: null,
            fieldType: zEFieldTypeDB.BLOB,
        },
        {
            fieldName: 'title',
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
        },
        {
            fieldName: 'sales_commission_percent',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2,
        },
        {
            fieldName: 'fee_withdraw_percent',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2,
        },
        {
            fieldName: 'opening_balance',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'balance',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'account_id',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldRelation: {
                tableName: 'account',
                fieldName: 'id',
            }
        },
        {
            fieldName: 'datetime_create',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldDefaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        {
            fieldName: 'datetime_update',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldDefaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    ]
};
