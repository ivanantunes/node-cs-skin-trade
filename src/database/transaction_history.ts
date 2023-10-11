import { zEFieldTypeDB, zITableDB } from 'zmodule-api';

export const transaction_history: zITableDB = {
    tableName: 'transaction_history',
    tableFields: [
        {
            fieldName: 'id',
            fieldPrimaryKey: true,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: true
        },
        {
            fieldName: 'purchase_and_sales_id',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldRelation: {
                tableName: 'purchase_and_sales',
                fieldName: 'id',
            }
        },
        {
            fieldName: 'item_price_on_steam',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'purchase_price',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'percent_discount_on_purchase',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'sale_value',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
        },
        {
            fieldName: 'percent_discount_on_sale',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2
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
            fieldName: 'balance_deducting_sales_commission',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2,
        },
        {
            fieldName: 'final_balance',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldPrecision: 2,
        },
        {
            fieldName: 'status',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.ENUM,
            fieldEnumValue: ['purchase', 'sold', 'steam_inventory', 'site_inventory', 'for_sale']
        },
    ]
};
