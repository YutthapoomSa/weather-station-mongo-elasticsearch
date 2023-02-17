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

// ────────────────────────────────────────────────────────────────────────────────

const lineNotify = require('line-notify-nodejs')('d3K7eG2kRtKVOA7RYQqESarSUwqQHGCvBjgQInDWN0E');
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
            const event = 'บันทึกข้อมูลสำเร็จ';

            // let transaction: TransactionDB = null;
            const id_elk = createTransactionDto.device_id
                ? new mongoose.Types.ObjectId(createTransactionDto.device_id).toString() + moment().format('YYYYMMDDHHmmss')
                : moment().format('YYYYMMDDHHmmss');

            const transaction = new this.transactionModel();
            transaction.device_id = createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null;
            transaction.id_elk = id_elk;
            transaction.pm2 = createTransactionDto.pm2;
            transaction.pm10 = createTransactionDto.pm10;
            transaction.site_name = createTransactionDto.site_name;
            transaction.heat_index = createTransactionDto.heat_index;
            transaction.coor_lat = createTransactionDto.coor_lat;
            transaction.coor_lon = createTransactionDto.coor_lon;
            transaction.humidity = createTransactionDto.humidity;
            transaction.temperature = createTransactionDto.temperature;
            transaction.date_data = createTransactionDto.date_data;

            // transaction = await this.transactionModel.create({
            //     device_id: createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null,
            //     pm2: createTransactionDto.pm2,
            //     pm10: createTransactionDto.pm10,
            //     site_name: createTransactionDto.site_name,
            //     heat_index: createTransactionDto.heat_index,
            //     coor_lat: createTransactionDto.coor_lat,
            //     coor_lon: createTransactionDto.coor_lon,
            //     humidity: createTransactionDto.humidity,
            //     temperature: createTransactionDto.temperature,
            //     date_data: createTransactionDto.date_data,
            // });

            console.log(id_elk);

            await axios
                .put(url + id_elk, createTransactionDto, { auth })
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
            const resultNoti = await transaction.save();
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
                    \n site_name: ${body.site_name}
                    \n PM2.5: ${body.pm2}
                    \n PM10: ${body.pm10}
                    \n Latitude: ${body.coor_lat}
                    \n Longitude: ${body.coor_lon}
                    \n Temperature: ${body.temperature}
                    \n humidity : ${body.humidity}
                    \n Data: ${body.date_data}
                    \n สถานะ: ${event}
                    \n เวลา : ${moment().locale('th').add(543, 'year').format('DD MM YYYY | hh:mm:ss a')}`,
                })
                .then(() => {
                    console.log('send completed!');
                });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
