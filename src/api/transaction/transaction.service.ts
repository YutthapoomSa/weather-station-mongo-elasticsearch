import { Injectable, InternalServerErrorException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { TransactionDB } from './../../entities/transaction.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateResTransaction, CreateTransactionDto } from './dto/create-transaction.dto';
import { FindOneTransactionDTO } from './dto/find-one.dto';
import { HttpModule } from '@nestjs/axios';
moment.tz.setDefault('Asia/Bangkok');
// ────────────────────────────────────────────────────────────────────────────────

const lineNotify = require('line-notify-nodejs')('d3K7eG2kRtKVOA7RYQqESarSUwqQHGCvBjgQInDWN0E');
// const lineNotify = require('line-notify-nodejs')('phz1Yp5FDCJ6ao9Yi7JRkFa3eB75VcXfMJ80nefhF3Z');
const url = 'https://2a62-171-100-8-238.ap.ngrok.io/weather-station/_doc/';
const username = 'elastic';
const password = 'P@ssw0rd2@22##';
const auth = {
    username: username,
    password: password,
};

// ────────────────────────────────────────────────────────────────────────────────

// const data = {
//     "device_id": '63e28157d4adb846d0f45998',
//     "pm2": 20,
//     "pm10": 20,
//     "site_name": 'test',
//     "heat_index": 120,
//     "coor_lat": 1.234,
//     "coor_lon": 5.6789,
//     "humidity": 20,
//     "temperature": 20,
//     "date_data": '2023-02-16 16:39:08',
// };
// ────────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
    private logger = new LogService(TransactionService.name);

    constructor(
        @InjectModel(TransactionDB.name)
        private readonly transactionModel: Model<TransactionDB>,
    ) {}
    async onApplicationBootstrap() {
        //     try {
        //         const user = await axios
        //             .get(url, data, {
        //                 auth,
        //             })
        //             .then();
        //         console.log('user', user);
        //     } catch (err) {
        //         console.error('err : ', JSON.stringify(err, null, 2));
        //     }
    }
    async create(createTransactionDto: CreateTransactionDto) {
        try {
            if (!createTransactionDto) throw new Error('Transaction is required !!');
            const event = 'บันทึกข้อมูลจากอุปกรณ์สำเร็จ';

            // const data = {
            //     device_id: 'string',
            //     id_elk: 'string',
            //     pm2: 'number',
            //     pm10: 'number',
            //     site_name: 'string',
            //     heat_index: 'number',
            //     // coor: {
            //     //     lat: 'number',
            //     //     lon: 'number',
            //     // },
            //     coor_lat: 'number',
            //     coor_lon: 'number',
            //     humidity: 'number',
            //     temperature: 'number',
            //     Altitude: 'string',
            //     Speed: 'string',
            //     date_data: 'string',
            // };

            const id_elk = createTransactionDto.device_id
                ? String(createTransactionDto.device_id + moment().format('YYYYMMDDHHmmss'))
                : moment().format('YYYYMMDDHHmmss');
            console.log('id_elk ->', JSON.stringify(id_elk, null, 2));

            // console.log('createTransactionDto', JSON.stringify(createTransactionDto, null, 2));

            const transactions = new this.transactionModel();
            transactions.device_id = createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null;
            transactions.id_elk = id_elk;
            transactions.pm2 = createTransactionDto.pm2;
            transactions.pm10 = createTransactionDto.pm10;
            transactions.site_name = createTransactionDto.site_name;
            transactions.heat_index = createTransactionDto.heat_index;
            transactions.coor = {
                lat: createTransactionDto.coor_lat ? createTransactionDto.coor_lat : 0,
                lon: createTransactionDto.coor_lon ? createTransactionDto.coor_lon : 0,
            };
            transactions.humidity = createTransactionDto.humidity;
            transactions.temperature = createTransactionDto.temperature;
            transactions.Altitude = createTransactionDto.Altitude;
            transactions.Speed = createTransactionDto.Speed;
            transactions.date_data = moment().format('YY-MM-DD HH:mm:ss').toString();

            const resultNoti = await transactions.save();
            console.log('transactions', JSON.stringify(transactions, null, 2));

            const transactionEa = transactions;
            const reNewTransactionEa = {
                device_id: transactionEa.device_id,
                id_elk: transactionEa.id_elk,
                pm2: transactionEa.pm2,
                pm10: transactionEa.pm10,
                site_name: transactionEa.site_name,
                heat_index: transactionEa.heat_index,
                coor_lat: transactionEa.coor.lat,
                coor_lon: transactionEa.coor.lon,
                humidity: transactionEa.humidity,
                temperature: transactionEa.temperature,
                Altitude: transactionEa.Altitude,
                Speed: transactionEa.Speed,
                date_data: transactionEa.date_data
                    ? moment(transactionEa.date_data).format('YY-MM-DD HH:mm:ss').toString
                    : moment().local().format('YY-MM-DD HH:mm:ss').toString(),
            };

            console.log('reNewTransactionEa', JSON.stringify(reNewTransactionEa, null, 2));

            await axios
                .put(url + id_elk, reNewTransactionEa, { auth })
                .then((results) => {
                    console.log('Result : ', JSON.stringify(results.data, null, 2));
                    //this.setState({ data: results.data.hits.hits });
                })
                .catch((error) => {
                    console.log('Failed to fetch -> ', error);
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                });

            if (!resultNoti) throw new Error('something went wrong try again later');
            await this.lineNotifySend(event, createTransactionDto);

            return new CreateResTransaction(ResStatus.success, 'Success', resultNoti);
        } catch (err) {
            console.error(err);
            throw new InternalServerErrorException(err);
        }
        //
    }

    async findOne(_id: string) {
        let transaction: TransactionDB;
        try {
            transaction = await this.transactionModel.findById({ id: _id }, '-__v');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!transaction) {
            throw new NotFoundException('User not found');
        }

        return new FindOneTransactionDTO(ResStatus.success, 'สำเร็จ', transaction);
    }

    async lineNotifySend(event: string, body: CreateTransactionDto) {
        try {
            lineNotify
                .notify({
                    message: `
                    \n Site_name: ${body.site_name}
                    \n PM2.5: ${body.pm2}
                    \n PM10: ${body.pm10}
                    \n Latitude: ${body.coor_lat}
                    \n Longitude: ${body.coor_lon}
                    \n Temperature: ${body.temperature}
                    \n Humidity : ${body.humidity}
                    \n Altitude : ${body.Altitude} feet
                    \n Speed :  ${body.Speed} KM/H
                    \n Date_data: ${moment(Date.now()).format('DD-MM-YYYY | hh:mm:ss a')}
                    \n สถานะ: ${event}
                    \n เวลา : ${moment().locale('th').add(543, 'year').format('YYYY-MM-DD  | hh:mm:ss a')}`,
                })
                .then(() => {
                    console.log('send completed!');
                });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
