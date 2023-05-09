import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ExcelJS from 'exceljs';
import moment from 'moment';
import mongoose, { Model } from 'mongoose';
import { TransactionDB } from './../../entities/transaction.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindOneTransactionDTO } from './dto/find-one.dto';
import { Sequelize } from 'sequelize';
import { DeviceDB } from 'src/entities/device.entity';

// moment.tz.setDefault('Asia/Bangkok');
moment.tz.setDefault('Asia/Bangkok');

// ────────────────────────────────────────────────────────────────────────────────

const lineNotify = require('line-notify-nodejs')('d3K7eG2kRtKVOA7RYQqESarSUwqQHGCvBjgQInDWN0E');
// const lineNotify = require('line-notify-nodejs')('phz1Yp5FDCJ6ao9Yi7JRkFa3eB75VcXfMJ80nefhF3Z');
const url = 'https://elastic.whsse.net/weather-station/_doc/';
// const url2 = 'https://84b3-202-44-231-125.ngrok-free.app/groundhog/_doc/';
const username = 'elastic';
const password = '0123456789';
const auth = {
    username: username,
    password: password,
};
const FormData = require('form-data');
const fs = require('fs');

// const siteName = ["FWH-Indoor-01", "FWH-Indoor-02"];
// ────────────────────────────────────────────────────────────────────────────────

// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// const ACCESS_TOKEN = 'h4xrEyudTxhk7Qzh3pELz6llr9SDk8g2HrW6lDzVSHV';
// let message = '';
// const IMAGE_URL = 'https://groundhog.whsse.net/groundhog/share/yellow.jpg';

// const formData = new FormData();
// formData.append('message', message);
// formData.append('imageThumbnail', IMAGE_URL);
// formData.append('imageFullsize', IMAGE_URL);

// axios.post('https://notify-api.line.me/api/notify', formData, {
//     headers: {
//         ...formData.getHeaders(),
//         'Authorization': `Bearer ${ACCESS_TOKEN}`
//     }
// })
//     .then((response) => {
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// ────────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
    private logger = new LogService(TransactionService.name);

    constructor(
        @InjectModel(TransactionDB.name)
        private readonly transactionModel: Model<TransactionDB>,
        @InjectModel(DeviceDB.name)
        private readonly deviceModel: Model<DeviceDB>,
    ) { }
    async onApplicationBootstrap() {
        //
    }
    async create(createTransactionDto: CreateTransactionDto) {
        try {
            if (!createTransactionDto) throw new Error('Transaction is required !!');
            const event = 'บันทึกข้อมูลจากอุปกรณ์สำเร็จ';

            const id_elkNew = createTransactionDto.device_id;

            const id_elk = createTransactionDto.device_id
                ? String(createTransactionDto.device_id + moment().format('YYYYMMDDHHmmss'))
                : moment().format('YYYYMMDDHHmmss');
            console.log('id_elk ->', JSON.stringify(id_elk, null, 2));

            console.log('createTransactionDto', JSON.stringify(createTransactionDto, null, 2));

            const transactions = new this.transactionModel();

            transactions.device_id = createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null;
            transactions.id_elk = id_elk;
            transactions.id_elkNew = id_elkNew;
            transactions.pm2 = createTransactionDto.pm2 ? createTransactionDto.pm2 : null;
            transactions.pm10 = createTransactionDto.pm10 ? createTransactionDto.pm10 : null;
            transactions.site_name = createTransactionDto.site_name ? createTransactionDto.site_name : null;
            transactions.heat_index = createTransactionDto.heat_index ? createTransactionDto.heat_index : null;;
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
                id_elkNew: transactionEa.id_elkNew,
                pm2: transactionEa.pm2 ? transactionEa.pm2 : null,
                pm10: transactionEa.pm10 ? transactionEa.pm10 : null,
                site_name: transactionEa.site_name ? transactionEa.site_name : null,
                heat_index: _heat_index,
                coor: {
                    lat: transactionEa.coor.lat ? transactionEa.coor.lat : null,
                    lon: transactionEa.coor.lon ? transactionEa.coor.lon : null,
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

            console.log('elasticsearchTransactionEa', JSON.stringify(reNewTransactionEa, null, 2));

            // ─────────────────────────────────────────────────────────────────────────────
            await axios
                .put(url + id_elk, reNewTransactionEa, { auth })
                .then((results) => {
                    console.log('Create Elastic : ', JSON.stringify(results.data, null, 2));
                    //this.setState({ data: results.data.hits.hits });
                })
                .catch((error) => {
                    console.log('Failed to fetch -> ', error);
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                });

            if (!resultNoti) throw new Error('something went wrong try again later');
            //await this.lineNotifySend(event, createTransactionDto);

            return new CreateResTransaction(ResStatus.success, 'Success', resultNoti);
        } catch (err) {
            throw new HttpException('error message', HttpStatus.BAD_REQUEST, { cause: new Error('Some Error') });
        }
    }

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
            lineNotify
                .notify({
                    message: `
                    \n Site_name: ${body.site_name}
                    \n PM2.5: ${body.pm2} ug/m3
                    \n PM10: ${body.pm10} ug/m3
                    \n Latitude: ${body.coor_lat}
                    \n Longitude: ${body.coor_lon}
                    \n HeatIndex: ${body.heat_index}
                    \n Temperature: ${body.temperature} °C
                    \n Humidity : ${body.humidity} %
                    \n Altitude : ${body.Altitude} feet
                    \n Speed :  ${body.Speed} KM/H
                    \n LightDetection :  ${body.lightDetection} lux
                    \n Noise :  ${body.noise} dB
                    \n carbondioxide :  ${body.carbondioxide} ppm
                    \n battery :  ${body.battery} %
                    \n type :  ${body.type}
                    \n Date_data: ${moment(Date.now()).format('DD-MM-YYYY | hh:mm:ss a')}
                    \n สถานะ: ${event}
                    \n เวลา : ${moment().locale('th').format('LLLL')}`,
                })
                .then(() => {
                    console.log('send completed!');
                });
        } catch (error) {
            console.log("ERROR =====> ", body.heat_index)
            console.log(error.message)
            throw new InternalServerErrorException(error);
        }
    }

    async exportToExcel(site_name: string, exportTime: Date): Promise<string> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transaction');

        // กำหนด header
        worksheet.columns = [
            { header: 'date_data', key: 'date_data', width: 20 },
            { header: 'site_name', key: 'site_name', width: 20 },
            { header: 'temperature', key: 'temperature', width: 20 },
            { header: 'humidity', key: 'humidity', width: 20 },
            { header: 'heat_index', key: 'heat_index', width: 20 },
            { header: 'pm2.5', key: 'pm2', width: 20 },
        ];

        // ค้นหาข้อมูลจากฐานข้อมูล
        const transactions = await this.transactionModel
            .find({ site_name: site_name })
            .exec();

        // กรอกข้อมูลลงใน Excel worksheet
        transactions.forEach((transaction) => {
            worksheet.addRow({
                date_data: transaction.date_data,
                site_name: transaction.site_name,
                temperature: transaction.temperature,
                humidity: transaction.humidity,
                heat_index: transaction.heat_index,
                pm2: transaction.pm2,
            });
        });

        // สร้างไฟล์ Excel ในโฟลเดอร์ output และกำหนดชื่อไฟล์ตามวันที่และเวลาที่ส่งออก
        const outputDir = './output';
        const outputFilename = `Transaction_${exportTime.toLocaleString()}.xlsx`;
        const outputPath = path.join(outputDir, outputFilename);
        await fs.promises.mkdir(outputDir, { recursive: true });
        await workbook.xlsx.writeFile(outputPath);

        return outputPath;
    }
}
