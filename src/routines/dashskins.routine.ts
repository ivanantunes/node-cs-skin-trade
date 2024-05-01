import axios from 'axios';
import { Observable, delay, expand, from, map, of, switchMap, takeWhile, tap } from 'rxjs';
import { DashskinsResponse, DashskinsResult } from '../interfaces';
import fs from 'fs';
import { zLoggerUtil } from 'zmodule-api';
import { Telegraf } from 'telegraf';

export class DashskinsRoutine {

    private constructor() { }

    private static listingItems(page: number): Observable<DashskinsResponse>  {
        return from(axios({
            baseURL: `https://dashskins.com.br`,
            url: `api/listing`,
            params: {
                search: '',
                item_type: '',
                rarity: '',
                itemset: '',
                exterior: '',
                weapon: '',
                has_sticker: '',
                has_stattrak: '',
                is_souvenir: '0',
                is_instant: '',
                sort_by: 'price',
                sort_dir: 'asc',
                limit: '120',
                page: `${page}`,
            },
            method: 'GET'
        })).pipe(
            map((result) => result.data)
        );
    }

    private static calculatePercentage(steamPrice: number, price: number): number {
        return ((steamPrice - price) / steamPrice) * 100;
    }

    private static getItemsByPercent(items: DashskinsResult[]): DashskinsResult[] {
        return items.filter((item) => DashskinsRoutine.calculatePercentage(item.steamPrice, item.price) >= Number(process.env.PERCENT_FOR_EVENT_ISSUANCE || 25));
    }

    private static generateLink(item: DashskinsResult): string {
        return `https://dashskins.com.br/item/${item.market_hash_name.replace(/[{()|™}]/g, '').replace(/[ ]/g, '-').toLowerCase()}/${item._id}`;
    }

    private static processItems(page: number, app: Telegraf, lastTotal?: number): Observable<number> {
        if (lastTotal === 0) {
            return of(0);
        }

        return DashskinsRoutine.listingItems(page).pipe(
            map((result) => result.results),
            // TODO: Searh Database itens exists
            map((rawItems) => {
                const items = DashskinsRoutine.getItemsByPercent(rawItems);

                items.forEach((item) => {
                    const message = [
                        `Nome do Item: ${item.name}`,
                        `Raridade do Item: ${item.rarity}`,
                        `Exterior do Item: ${item.exterior}`,
                        `Preço na Steam: ${item.steamPrice}`,
                        `Preço na Daskskins: ${item.price}`,
                        `Desconto: ${DashskinsRoutine.calculatePercentage(item.steamPrice, item.price).toFixed(2)}%`,
                        `Link do Item: ${DashskinsRoutine.generateLink(item)}`,
                    ];

                    app.telegram.sendMessage(`XXXXXXXX`, message.join(`\n`));
                });

                zLoggerUtil.info({}, `Total Items on Page ${page} (Dashskins): ${rawItems.length} | Total Items By Percent: ${items.length}`);

                return rawItems.length;
            }),
            // TODO: Format Message
            // ! URL Show Item in Site: /item/five-seven-withered-vine-field-tested/654306bcebc8567e53d74019
        );
    }

    public static startRoutine(): void {
        let page = 1;

        const app = new Telegraf(process.env.TELEGRAM_BOT_KEY as string);

        zLoggerUtil.info({}, 'Starting Routine (Dashskins)');
        DashskinsRoutine.processItems(page++, app).pipe(
            expand((prev) => DashskinsRoutine.processItems(page++, app, prev)),
            takeWhile((total) => total > 0)
        ).subscribe({
            complete: () => zLoggerUtil.info({}, 'Routine (Dashskins) Finish With Successfully'),
            error: (error) => zLoggerUtil.error(error, 'Routine (Dashskins) Error'),
        });
    }

}
