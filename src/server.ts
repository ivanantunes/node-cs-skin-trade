// import { zDatabaseController, zWebService, zLoggerUtil } from 'zmodule-api';
// import { account, site, purchase_and_sales, transaction_history } from './database';
// import { switchMap, tap } from 'rxjs';
// import path from 'path';
// import express from 'express';
// import { v1 } from './api';
// import cluster from 'cluster';
// import { cpus } from 'os';

// const tables = [account, site, purchase_and_sales, transaction_history];

// if (cluster.isPrimary) {
//     cpus().forEach(() => {
//         cluster.fork();
//     });
// } else {
//     zDatabaseController.getInstance().createTables(tables).pipe(
//         switchMap(() => zWebService.getInstance().startWebService()),
//         tap((app) => {
//             // TODO: Add Routers
//             app.use('', express.static(path.join(__dirname, '..', 'app/pages')));
//             app.use('/', express.static(path.join(__dirname, '..', 'app/pages')));
//             app.use('/web/libs', express.static(path.join(__dirname, '..', 'app/libs')));
//             app.use('/web/assets', express.static(path.join(__dirname, '..', 'app/assets')));
//             app.use('/web/scripts', express.static(path.join(__dirname, '..', 'app/scripts')));
//             app.use('/api/v1', v1);

//             app.get('/stress-test/:id', (req, res) => {
//                 zLoggerUtil.info({}, `Request ${req.params.id}`);
//                 let counter = 0;

//                 while (counter < 900000000) {
//                     counter++;
//                 }

//                 res.status(200).send(`${counter} iterations completed!`);
//             });
//         })
//     ).subscribe({
//         complete: () => zLoggerUtil.info({}, 'Application is Running'),
//         error: (error) => zLoggerUtil.error(error, 'Failed Start Application'),
//     });
// }

export const COLORS = [
    'black',
    'brown',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'violet',
    'grey',
    'white'
];

export const OHMS = [
    [1_000_000_000, 'giga'],
    [1_000_000, 'mega'],
    [1_000, 'kilo']
];

export function decodedResistorValue([colorOne, colorTwo, colorThree]: string[]) : string {
    const calcColorOne = (COLORS.indexOf(colorOne) * 10);
    const indexColorTwo = COLORS.indexOf(colorTwo);
    const decodedValue = calcColorOne + indexColorTwo;
    const calcAmountZero = 10 ** COLORS.indexOf(colorThree);
    let num = decodedValue * calcAmountZero;

    // let num = ((ColorAry.indexOf(band1) * 10) + ColorAry.indexOf(band2)) * (10 ** ColorAry.indexOf(band3))
  // inspired by https://exercism.org/tracks/typescript/exercises/resistor-color-trio/solutions/c6p
    const [divisor, prefix] = OHMS.find(([divisor]) => num >= Number(divisor)) ?? [1, ""]
    return `${num / Number(divisor)} ${prefix}ohms`
}

// inspired by https://exercism.org/tracks/typescript/exercises/resistor-color-trio/solutions/bobahop

console.log(decodedResistorValue(['blue', 'green', 'brown'])); // omhs
console.log(decodedResistorValue(['red', 'black', 'red'])); // kiloomhs
console.log(decodedResistorValue(['green', 'brown', 'orange'])); // kiloomhs
console.log(decodedResistorValue(['blue', 'violet', 'blue'])); // megaomhs
console.log(decodedResistorValue(['black', 'black', 'black'])); // omhs
