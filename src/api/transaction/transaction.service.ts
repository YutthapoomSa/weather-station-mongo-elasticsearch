import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { DeviceDB } from 'src/entities/device.entity';
import { TransactionDB } from './../../entities/transaction.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindOneTransactionDTO } from './dto/find-one.dto';

// moment.tz.setDefault('Asia/Bangkok');
moment.tz.setDefault('Asia/Bangkok');

// ────────────────────────────────────────────────────────────────────────────────

const lineNotify = require('line-notify-nodejs')('DLwHWm8xXmJukvnH9ZG3kwuNkxy8omRy1eyn21fVvT4');
// const lineNotify = require('line-notify-nodejs')('phz1Yp5FDCJ6ao9Yi7JRkFa3eB75VcXfMJ80nefhF3Z');
const url = 'https://elastic.whsse.net/weather-station/_doc/';
// const url2 = 'https://elastic.whsse.net/weather-station-Omega/_doc/';
const username = 'elastic';
const password = '0123456789';
const auth = {
    username: username,
    password: password,
};

// const siteName = ["FWH-Indoor-01", "FWH-Indoor-02"];
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
        @InjectModel(DeviceDB.name)
        private readonly deviceModel: Model<DeviceDB>,
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

            const id_elk = createTransactionDto.device_id
                ? String(createTransactionDto.device_id + moment().format('YYYYMMDDHHmmss'))
                : moment().format('YYYYMMDDHHmmss');
            console.log('id_elk ->', JSON.stringify(id_elk, null, 2));

            console.log('createTransactionDto', JSON.stringify(createTransactionDto, null, 2));

            const transactions = new this.transactionModel();
            transactions.device_id = createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null;
            transactions.id_elk = id_elk;
            transactions.pm2 = createTransactionDto.pm2 ? createTransactionDto.pm2 : null;
            transactions.pm10 = createTransactionDto.pm10 ? createTransactionDto.pm10 : null;
            transactions.site_name = createTransactionDto.site_name ? createTransactionDto.site_name : null;
            transactions.heat_index = createTransactionDto.heat_index ? createTransactionDto.heat_index : null;
            transactions.coor = {
                lat: createTransactionDto.coor_lat ? createTransactionDto.coor_lat : 0,
                lon: createTransactionDto.coor_lon ? createTransactionDto.coor_lon : 0,
            };
            transactions.humidity = createTransactionDto.humidity ? createTransactionDto.humidity : null;
            transactions.temperature = createTransactionDto.temperature ? createTransactionDto.temperature : null;
            transactions.Altitude = createTransactionDto.Altitude ? createTransactionDto.Altitude : null;
            transactions.Speed = createTransactionDto.Speed ? createTransactionDto.Speed : null;
            transactions.lightDetection = createTransactionDto.lightDetection ? createTransactionDto.lightDetection : null;
            transactions.noise = createTransactionDto.noise ? createTransactionDto.noise : null;
            transactions.carbondioxide = createTransactionDto.carbondioxide ? createTransactionDto.carbondioxide : null;
            transactions.battery = createTransactionDto.battery ? createTransactionDto.battery : null;
            transactions.type = createTransactionDto.type ? createTransactionDto.type : null;
            transactions.deviceList = createTransactionDto.deviceList?.map((device) => {
                const _device = new this.deviceModel();
                _device.serialNumber = device.serialNumber || null;
                _device.device_name = device.device_name || null;
                return _device;
            });
            if (transactions.deviceList && transactions.deviceList.length > 0) {
                for (const iterator of transactions.deviceList) {
                    await iterator.save();
                }
            }
            transactions.date_data = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');
            transactions.date_data7 = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');

            // const resultTempMapSite = siteName ===  transactions.temperature;
            const resultNoti = await transactions.save();
            // await transactions.save();
            console.log('transactions', JSON.stringify(transactions, null, 2));

            // ─────────────────────────────────────────────────────────────────────────────

            const transactionEa = transactions;
            const timestamp = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');

            let _temp = 0;
            if (transactionEa.site_name == 'FWH-Indoor-01') _temp = transactionEa.temperature - 2;
            else if (transactionEa.site_name == 'FWH-Indoor-02') _temp = transactionEa.temperature - 2;
            else if (transactionEa.site_name == 'FWH-Outdoor-01') _temp = transactionEa.temperature + 2;
            else _temp = transactionEa.temperature;

            let _humidity = 0;
            if (transactionEa.site_name == 'FWH-Outdoor-01') _humidity = transactionEa.humidity + 5;
            else _humidity = transactionEa.humidity;

            let _heat_index = 0;
            if (transactionEa.site_name == 'FWH-Outdoor-01') _heat_index = transactionEa.heat_index + 7;
            else _heat_index = transactionEa.heat_index;

            let _battery = 0;
            if (transactionEa.site_name == 'FWH-Outdoor-01') _battery = transactionEa.battery + 10;
            else _battery = transactionEa.battery;
            // let _humidity = 0;
            // if (transactionEa.humidity == 'FWH-Indoor-01') _humidity = transactionEa.humidity - 2;
            // else if (transactionEa.humidity == 'FWH-Indoor-02') _humidity = transactionEa.humidity - 2;
            // else _humidity = transactionEa.humidity;
            // ─────────────────────────────────────────────────────────────────────────────

            const reNewTransactionEa = {
                device_id: transactionEa.device_id ? transactionEa.device_id : null,
                id_elk: transactionEa.id_elk,
                pm2: transactionEa.pm2 ? transactionEa.pm2 : null,
                pm10: transactionEa.pm10 ? transactionEa.pm10 : null,
                site_name: transactionEa.site_name ? transactionEa.site_name : null,
                heat_index: _heat_index,
                coor: {
                    lat: transactionEa.coor.lat ? transactionEa.coor.lat : 0,
                    lon: transactionEa.coor.lon ? transactionEa.coor.lon : 0,
                },
                humidity: _humidity,
                //temperature: siteName.includes("FWH-Indoor-01") ? transactionEa.temperature - 2 : transactionEa.temperature,
                temperature: _temp,
                Altitude: transactionEa.Altitude ? transactionEa.Altitude : null,
                Speed: transactionEa.Speed ? transactionEa.Speed : null,
                lightDetection: transactionEa.lightDetection ? transactionEa.lightDetection : null,
                noise: transactionEa.noise ? transactionEa.noise : null,
                carbondioxide: transactionEa.carbondioxide ? transactionEa.carbondioxide : null,
                battery: _battery,
                type: transactionEa.type ? transactionEa.type : null,
                date_type: transactionEa.date_data,
                date_data: moment().format().toString(),
                deviceList: transactionEa.deviceList,
                // date_data: timestamp,
                date_data7: transactionEa.date_data7,
            };
            // date_data: moment().format('YYYY-MM-DD HH:mm:ss').toString(),

            console.log('reNewTransactionEa', JSON.stringify(reNewTransactionEa, null, 2));

            // ─────────────────────────────────────────────────────────────────────────────

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

            return ResStatus.success, 'Success', resultNoti;
        } catch (err) {
            throw new HttpException('error message', HttpStatus.BAD_REQUEST, { cause: new Error('Some Error') });
        }
        //
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // async createOmega(createTransactioReqnDto: CreatTransactionReqDTO, deviceData: deviceData) {
    //     try {
    //         if (!createTransactioReqnDto) throw new Error('Transaction is required !!');
    //         const event = 'บันทึกข้อมูลจากอุปกรณ์สำเร็จ';

    //         const id_elkOmega = deviceData.serialNumber
    //             ? String(deviceData.serialNumber + moment().format('YYYYMMDDHHmmss'))
    //             : moment().format('YYYYMMDDHHmmss');
    //         console.log('id_elk ->', JSON.stringify(id_elkOmega, null, 2));

    //         console.log('createTransactioReqnDto', JSON.stringify(createTransactioReqnDto, null, 2));

    //         const transactions = new this.transactionModel();
    //         transactions.id_elkOmega = id_elkOmega;
    //         transactions.pm2 = createTransactioReqnDto.pm2 ? createTransactioReqnDto.pm2 : null;
    //         transactions.site_name = createTransactioReqnDto.site_name ? createTransactioReqnDto.site_name : null;
    //         transactions.heat_index = createTransactioReqnDto.heat_index ? createTransactioReqnDto.heat_index : null;
    //         transactions.coor = {
    //             lat: createTransactioReqnDto.coor_lat ? createTransactioReqnDto.coor_lat : 0,
    //             lon: createTransactioReqnDto.coor_lon ? createTransactioReqnDto.coor_lon : 0,
    //         };
    //         transactions.humidity = createTransactioReqnDto.humidity ? createTransactioReqnDto.humidity : null;
    //         transactions.temperature = createTransactioReqnDto.temperature ? createTransactioReqnDto.temperature : null;
    //         transactions.battery = createTransactioReqnDto.battery ? createTransactioReqnDto.battery : null;
    //         transactions.type = createTransactioReqnDto.type ? createTransactioReqnDto.type : null;
    //         transactions.deviceList = [];
    //         if (transactions.deviceList && transactions.deviceList.length > 0) {
    //             for (const iterator of transactions.deviceList) {
    //                 const _device = new this.deviceModel();
    //                 _device.serialNumber = iterator.serialNumber ? iterator.serialNumber : null;
    //                 _device.device_name = iterator.device_name ? iterator.device_name : null;
    //                 transactions.deviceList.push(_device);
    //             }
    //         }

    //         transactions.date_data = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');
    //         transactions.date_data7 = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');

    //         // const resultTempMapSite = siteName ===  transactions.temperature;
    //         const resultNoti = await transactions.save();
    //         console.log('transactions', JSON.stringify(transactions, null, 2));

    //         // ─────────────────────────────────────────────────────────────────────────────

    //         const transactionEa2 = transactions;
    //         const timestamp = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');

    //         let _temp = 0;
    //         if (transactionEa2.site_name == 'FWH-Indoor-01') _temp = transactionEa2.temperature - 2;
    //         else if (transactionEa2.site_name == 'FWH-Indoor-02') _temp = transactionEa2.temperature - 2;
    //         else if (transactionEa2.site_name == 'FWH-Outdoor-01') _temp = transactionEa2.temperature + 2;
    //         else _temp = transactionEa2.temperature;

    //         let _humidity = 0;
    //         if (transactionEa2.site_name == 'FWH-Outdoor-01') _humidity = transactionEa2.humidity + 5;
    //         else _humidity = transactionEa2.humidity;

    //         let _heat_index = 0;
    //         if (transactionEa2.site_name == 'FWH-Outdoor-01') _heat_index = transactionEa2.heat_index + 7;
    //         else _heat_index = transactionEa2.heat_index;

    //         let _battery = 0;
    //         if (transactionEa2.site_name == 'FWH-Outdoor-01') _battery = transactionEa2.battery + 10;
    //         else _battery = transactionEa2.battery;
    //         // let _humidity = 0;
    //         // if (transactionEa.humidity == 'FWH-Indoor-01') _humidity = transactionEa.humidity - 2;
    //         // else if (transactionEa.humidity == 'FWH-Indoor-02') _humidity = transactionEa.humidity - 2;
    //         // else _humidity = transactionEa.humidity;
    //         // ─────────────────────────────────────────────────────────────────────────────

    //         const reNewTransactionEa2 = {
    //             id_elkOmega: transactionEa2.id_elkOmega,
    //             pm2: transactionEa2.pm2 ? transactionEa2.pm2 : null,
    //             site_name: transactionEa2.site_name ? transactionEa2.site_name : null,
    //             heat_index: _heat_index,
    //             coor: {
    //                 lat: transactionEa2.coor.lat ? transactionEa2.coor.lat : 0,
    //                 lon: transactionEa2.coor.lon ? transactionEa2.coor.lon : 0,
    //             },
    //             humidity: _humidity,
    //             temperature: _temp,
    //             battery: _battery,
    //             type: transactionEa2.type ? transactionEa2.type : null,
    //             deviceList: transactionEa2.deviceList,
    //             date_type: transactionEa2.date_data,
    //             date_data: moment().format().toString(),
    //             // date_data: timestamp,
    //             date_data7: transactionEa2.date_data7,
    //         };
    //         // date_data: moment().format('YYYY-MM-DD HH:mm:ss').toString(),

    //         console.log('reNewTransactionEa2', JSON.stringify(reNewTransactionEa2, null, 2));

    //         // ─────────────────────────────────────────────────────────────────────────────

    //         await axios
    //             .put(url2 + id_elkOmega, reNewTransactionEa2, { auth })
    //             .then((results) => {
    //                 console.log('Result : ', JSON.stringify(results.data, null, 2));
    //                 //this.setState({ data: results.data.hits.hits });
    //             })
    //             .catch((error) => {
    //                 console.log('Failed to fetch -> ', error);
    //                 // console.log(error.response.data);
    //                 // console.log(error.response.status);
    //                 // console.log(error.response.headers);
    //             });

    //         if (!resultNoti) throw new Error('something went wrong try again later');
    //         //await this.lineNotifySend(event, createTransactionDto);

    //         return new CreateResTransaction(ResStatus.success, 'Success', resultNoti);
    //     } catch (err) {
    //         console.error(err);
    //         throw new InternalServerErrorException(err);
    //     }
    //     //
    // }
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

    async getDevicesBySiteName(site_name: string) {
        const site = await this.transactionModel.findOne({ site_name: site_name }).populate('device_id', 'device_name');
        return site;
    }

    // async getAllDevicesBySiteName(site_name: string) {
    //     const sites = await this.transactionModel
    //       .find({ site_name: site_name })
    //       .populate([{ path: 'device_id', select: 'device_name' }]);
    //     return sites;
    //   }

    async lineNotifySend(event: string, body: CreateTransactionDto) {
        try {
            const outdoor01 = body.site_name === 'FWH-Outdoor-o1';
            const outdoor02 = body.site_name === 'strin33333g';
            const currentTime = moment().locale('th');
            let message = '';
            if (outdoor01 && body.heat_index >= 40 && body.heat_index <= 50) {
                message += `
                \n• ค่าดัชนีความร้อนคือ ${body.heat_index}
                \n• จุดติดตั้ง ${body.site_name}
                \n• ละติจูด: ${body.coor_lat} ลองจิจูด: ${body.coor_lon}
                \n• ทำการฝึก 30 นาทีและพัก 30 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี)`;
            } else if (outdoor02 && body.heat_index >= 40 && body.heat_index <= 50) {
                message += `
                \n• ค่าดัชนีความร้อนคือ ${body.heat_index}
                \n• จุดติดตั้ง ${body.site_name}
                \n• ละติจูด:${body.coor_lat} ลองจิจูด:${body.coor_lon}
                \n• ทำการฝึก 30 นาทีและพัก 30 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี)`;
            } else if (outdoor01 && outdoor02 && body.heat_index > 50) {
                message += `
                  \n• ค่าดัชนีความร้อนคือ ${body.heat_index}
                  \n• ทำการฝึก 30 นาทีและพัก 30 นาที
                  \n• ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี)`;
            }
            if (currentTime.isBetween(moment('08:00', 'HH:mm'), moment('08:59', 'HH:mm'))) {
                message += `\n• รอบเวลา: 8.00 am - 08.59 am
                -------------------------------------------------------`;
            }
            if (currentTime.isBetween(moment('09:00', 'HH:mm'), moment('10:59', 'HH:mm'))) {
                message += `\n• รอบเวลา: 09.00 am - 10.59 am
                -------------------------------------------------------`;
            }
            if (currentTime.isBetween(moment('13:00', 'HH:mm'), moment('13:59', 'HH:mm'))) {
                message += `\nรอบเวลา: 13.00 pm - 13.59 pm
                -------------------------------------------------------`;
            }
            if (currentTime.isBetween(moment('15:00', 'HH:mm'), moment('15:59', 'HH:mm'))) {
                message += `\nรอบเวลา: 15.00 pm - 15.59 pm
                -------------------------------------------------------`;
            }
            if (currentTime.isBetween(moment('17:00', 'HH:mm'), moment('17:59', 'HH:mm'))) {
                message += `\nรอบเวลา: 17.00 pm - 17.59 pm
                -------------------------------------------------------`;
            }
            if (message && body.heat_index >= 40 && body.heat_index <= 50) {
                message += '\nตรวจสอบ dashboard: https://groundhog.whsse.net/weather-station/frontend/web/index.php?r=site/login';
                message += `\n${currentTime.format('LL เวลา: HH:mm:ss')}`;
                lineNotify.notify({ message }).then(() => {
                    console.log('send completed!');
                });
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
