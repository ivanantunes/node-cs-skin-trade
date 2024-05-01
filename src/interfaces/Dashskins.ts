export interface DashskinsResponse {
    results: DashskinsResult[];
    count: number;
    page: number;
    limit: number;
    query: DashskinsQuery;
}

export interface DashskinsQuery {
    search: string;
    item_type: string;
    rarity: string;
    itemset: string;
    exterior: string;
    weapon: string;
    has_sticker: string;
    has_stattrak: string;
    is_souvenir: string;
    is_instant: string;
    sort_by: string;
    sort_dir: string;
    limit: string;
    page: string;
}

export interface DashskinsResult {
    _id: string;
    user: string;
    bot: DashskinsBot;
    appID: number;
    contextID: number;
    assetid: string;
    icon_url: string;
    name: string;
    market_hash_name: string;
    type: string;
    color: string;
    rarity: string;
    item_type: string;
    weapon: string;
    itemset?: string;
    quality: string;
    exterior: string;
    descriptions: DashskinsDescription[];
    actions: DashskinsAction[];
    stickers: any[];
    wear_data: DashskinsWeardata;
    listed: boolean;
    price: number;
    bonus?: any;
    steamPrice: number;
    availableAt: string;
    __v: number;
    bumpedAt?: string;
}

export interface DashskinsWeardata {
    stickers: any[];
    defindex: number;
    floatvalue: number;
    image: string;
    paintindex: number;
    paintseed: number;
    quality: number;
    rarity: number;
}

export interface DashskinsAction {
    link: string;
    name: string;
}

export interface DashskinsDescription {
    type: string;
    value: string;
    color?: string;
}

export interface DashskinsBot {
    steamID64: string;
}
