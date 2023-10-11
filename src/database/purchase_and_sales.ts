import { zEFieldTypeDB, zITableDB } from 'zmodule-api';

export const purchase_and_sales: zITableDB = {
    tableName: 'purchase_and_sales',
    tableFields: [
        {
            fieldName: 'id',
            fieldPrimaryKey: true,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldAutoIncrement: true
        },
        {
            fieldName: 'item_image',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldAllowNull: true,
            fieldDefaultValue: null,
            fieldType: zEFieldTypeDB.BLOB,
        },
        {
            fieldName: 'item_name',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldSize: 255
        },
        {
            fieldName: 'item_exterior',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldType: zEFieldTypeDB.ENUM,
            fieldAllowNull: true,
            fieldDefaultValue: null,
            fieldEnumValue: ['FN', 'MW', 'FT', 'WW', 'BS']
        },
        {
            fieldName: 'item_rarity',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldType: zEFieldTypeDB.ENUM,
            fieldAllowNull: true,
            fieldDefaultValue: null,
            fieldEnumValue: ['CG', 'IG', 'MSH', 'RE', 'CL', 'CO']
        },
        {
            fieldName: 'item_type',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldType: zEFieldTypeDB.VARCHAR,
            fieldAllowNull: true,
            fieldDefaultValue: null,
            fieldSize: 255
        },
        {
            fieldName: 'item_float',
            fieldPrimaryKey: false,
            fieldRequired: false,
            fieldType: zEFieldTypeDB.FLOAT,
            fieldAllowNull: true,
            fieldDefaultValue: null,
        },
        {
            fieldName: 'item_is_stattrak',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BOOLEAN,
            fieldDefaultValue: false,
        },
        {
            fieldName: 'item_has_sticker',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BOOLEAN,
            fieldDefaultValue: false,
        },
        {
            fieldName: 'item_is_souvenir',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BOOLEAN,
            fieldDefaultValue: false,
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
        {
            fieldName: 'site_id',
            fieldPrimaryKey: false,
            fieldRequired: true,
            fieldType: zEFieldTypeDB.BIGINT,
            fieldRelation: {
                tableName: 'site',
                fieldName: 'id',
            }
        }
    ]
};
