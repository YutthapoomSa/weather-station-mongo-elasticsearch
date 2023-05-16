// import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import moment from 'moment';
// import mongoose, { Model } from 'mongoose';
// import { DeviceDB } from 'src/entities/device.entity';
// import { TransactionDB } from './../../entities/transaction.entity';
// import { LogService } from './../../services/log.service';
// import { ResStatus } from './../../share/enum/res-status.enum';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { FindOneTransactionDTO } from './dto/find-one.dto';
// // const axios = require('axios');
// // moment.tz.setDefault('Asia/Bangkok');
// moment.tz.setDefault('Asia/Bangkok');

// // ────────────────────────────────────────────────────────────────────────────────

// // const ACCESS_TOKEN = 'h4xrEyudTxhk7Qzh3pELz6llr9SDk8g2HrW6lDzVSHV';
// // const lineNotify = require('line-notify-nodejs')('h4xrEyudTxhk7Qzh3pELz6llr9SDk8g2HrW6lDzVSHV');
// const url = 'https://elastic.whsse.net/weather-station/_doc/';
// const url2 = 'https://elastic.whsse.net/weather-station-device/_doc/';
// const username = 'elastic';
// const password = '0123456789';
// const auth = {
//     username: username,
//     password: password,
// };
// const FormData = require('form-data');
// const fs = require('fs');

// var alert_heat_index = false;
// var status_heat_index = true;
// var currentTime = moment().locale('th');
// // currentTime.subtract(1, 'day');
// var current_date = currentTime.date();
// var status_hour = true;
// const axios = require('axios');
// let message: '';
// var flag = {
//     white: 'https://groundhog.whsse.net/groundhog/share/white.jpg',
//     green: 'https://groundhog.whsse.net/groundhog/share/green.jpg',
//     yellow: 'https://groundhog.whsse.net/groundhog/share/yellow.jpg',
//     red: 'https://groundhog.whsse.net/groundhog/share/red.jpg',
//     black: 'https://groundhog.whsse.net/groundhog/share/black.png',
// };

// var sendNotifyFlag = [0, 0, 0, 0, 0];

// // const siteName = ["FWH-Indoor-01", "FWH-Indoor-02"];
// // ────────────────────────────────────────────────────────────────────────────────

// // const FormData = require('form-data');
// // const fs = require('fs');

// // const ACCESS_TOKEN = 'h4xrEyudTxhk7Qzh3pELz6llr9SDk8g2HrW6lDzVSHV';
// // let message = '';
// // const IMAGE_URL = 'https://groundhog.whsse.net/groundhog/share/yellow.jpg';

// // const formData = new FormData();
// // formData.append('message', message);
// // formData.append('imageThumbnail', IMAGE_URL);
// // formData.append('imageFullsize', IMAGE_URL);

// // axios.post('https://notify-api.line.me/api/notify', formData, {
// //     headers: {
// //         ...formData.getHeaders(),
// //         'Authorization': `Bearer ${ACCESS_TOKEN}`
// //     }
// // })
// //     .then((response) => {
// //         console.log(response.data);
// //     })
// //     .catch((error) => {
// //         console.error(error);
// //     });
// // ────────────────────────────────────────────────────────────────────────────────

// @Injectable()
// export class TransactionService implements OnApplicationBootstrap {
//     private logger = new LogService(TransactionService.name);

//     constructor(
//         @InjectModel(TransactionDB.name)
//         private readonly transactionModel: Model<TransactionDB>,
//         @InjectModel(DeviceDB.name)
//         private readonly deviceModel: Model<DeviceDB>,
//     ) { }
//     async onApplicationBootstrap() {
//         //
//     }
//     async siteMapping(site_name: string) {
        
//         return site_name;
//     }

//     async dashboardMapping(site_name: string) {
        
//         return 'www.google.com/aaa';
//     }

//     async create(createTransactionDto: CreateTransactionDto) {
//         const tag = this.create.name;
//         try {
//             if (!createTransactionDto) throw new Error('Transaction is required !!');
//             // console.log('createTransactionDto', JSON.stringify(createTransactionDto, null, 2));

//             const id_elk = createTransactionDto.device_id
//                 ? String(createTransactionDto.device_id + moment().format('YYYYMMDDHHmmss'))
//                 : moment().format('YYYYMMDDHHmmss');
//             // console.log('id_elk ->', JSON.stringify(id_elk, null, 2));

//             const id_elkNew = createTransactionDto.device_id

//             // console.log('id_elk ->', JSON.stringify(id_elk, null, 2));



//             const transactions = new this.transactionModel();
//             transactions.device_id = createTransactionDto.device_id ? new mongoose.Types.ObjectId(createTransactionDto.device_id) : null;
//             transactions.id_elk = id_elk;
//             transactions.id_elkNew = id_elkNew;
//             transactions.pm2 = createTransactionDto.pm2 ? createTransactionDto.pm2 : null;
//             transactions.pm10 = createTransactionDto.pm10 ? createTransactionDto.pm10 : null;

//             transactions.site_name = createTransactionDto.site_name ? (createTransactionDto.site_name) : null;
            

//             transactions.site_name = await this.siteMapping(createTransactionDto.site_name);

//             transactions.heat_index = createTransactionDto.heat_index ? createTransactionDto.heat_index : null;
//             transactions.coor = {
//                 lat: createTransactionDto.coor_lat ? createTransactionDto.coor_lat : 0,
//                 lon: createTransactionDto.coor_lon ? createTransactionDto.coor_lon : 0,
//             };
//             transactions.humidity = createTransactionDto.humidity ? createTransactionDto.humidity : null;
//             transactions.temperature = createTransactionDto.temperature ? createTransactionDto.temperature : null;
//             transactions.Altitude = createTransactionDto.Altitude ? createTransactionDto.Altitude : null;
//             transactions.Speed = createTransactionDto.Speed ? createTransactionDto.Speed : null;
//             transactions.lightDetection = createTransactionDto.lightDetection ? createTransactionDto.lightDetection : null;
//             transactions.noise = createTransactionDto.noise ? createTransactionDto.noise : null;
//             transactions.carbondioxide = createTransactionDto.carbondioxide ? createTransactionDto.carbondioxide : null;
//             transactions.battery = createTransactionDto.battery ? createTransactionDto.battery : null;
//             transactions.type = createTransactionDto.type ? createTransactionDto.type : null;
//             transactions.deviceList = createTransactionDto.deviceList?.map((device) => {
//                 const _device = new this.deviceModel();
//                 _device.serialNumber = device.serialNumber || null;
//                 _device.device_name = device.device_name || null;
//                 return _device;
//             });
//             if (transactions.deviceList && transactions.deviceList.length > 0) {
//                 for (const iterator of transactions.deviceList) {
//                     await iterator.save();
//                 }
//             }
//             transactions.date_data = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');
//             transactions.date_data7 = moment().tz('asia/Bangkok').add(543, 'year').format('DD-MM-YYYY HH:mm:ss');

//             const resultNoti = await transactions.save();
//             // await transactions.save();
//             // console.log('transactions =:} ', JSON.stringify(transactions, null, 2));

//             // ─────────────────────────────────────────────────────────────────────────────

//             const transactionEa = transactions;

//             let _site = ''; 
//                 _site = this.siteMapping(transactionEa.temperature);

//                // AA
//             let _temp = 0;

//             if (transactionEa.site_name == 'FWH-Indoor-01') _temp = transactionEa.temperature - 0;
//             else if (transactionEa.site_name == 'FWH-Indoor-02') _temp = transactionEa.temperature - 0;
//             else if (transactionEa.site_name == 'FWH-Outdoor-01') _temp = transactionEa.temperature + 0;
//             else _temp = transactionEa.temperature;

//             let _humidity = 0;
//             if (transactionEa.site_name == 'FWH-Outdoor-01') _humidity = transactionEa.humidity + 0;
//             else _humidity = transactionEa.humidity;

//             let _heat_index = 0;
//             if (transactionEa.site_name == 'FWH-Outdoor-01') _heat_index = transactionEa.heat_index + 0;
//             else _heat_index = transactionEa.heat_index;

//             let _battery = 0;
//             if (transactionEa.site_name == 'FWH-Outdoor-01') _battery = transactionEa.battery + 0;
//             else _battery = transactionEa.battery;

//             let _dashboard = 'www.google.com';

//             /*

//             if (transactionEa.site_name == 'FWH-Outdoor-01') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-01';
//             if (transactionEa.site_name == 'FWH-Indoor-02') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-02';
//             if (transactionEa.site_name == 'FWH-Indoor-03') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-03';
//             if (transactionEa.site_name == 'FWH-Outdoor-01') _dashboard = 'www.google.com';
//             if (transactionEa.site_name == 'FWH-Omega-01') _dashboard = 'www.google.com';
//             if (transactionEa.site_name == 'FWH-Omega-02') _dashboard = 'www.google.com';
//             if (transactionEa.site_name == 'FWH-Omega-03') _dashboard = 'www.google.com';
//             if (transactionEa.site_name == 'FWH-Omega-04') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-04';

//             */

//             if (transactionEa.site_name ==  'FWH-Indoor-01') _dashboard = 'https://groundhog-wh.whsse.net/server-room-administration-building';  //then 'server room อาคารอำนวยการ'
//             if (transactionEa.site_name ==  'FWH-Indoor-02') _dashboard = 'https://groundhog-wh.whsse.net/server-room-5th'; //then 'server room ชั้น 5'
//             //if (transactionEa.site_name ==  'FWH-Indoor-03' then 'ห้องโถงชั้น 1 อาคาร OPD'
//             if (transactionEa.site_name ==  'FWH-Outdoor-01') _dashboard = 'https://groundhog-wh.whsse.net/hot-air-center'; //then 'ศูนย์ลมร้อน ร.พ.ค่ายวชิราวุธ'
//             if (transactionEa.site_name ==  'FWH-Omega-01') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-01'; //then 'ป.5พัน.105'
//             if (transactionEa.site_name ==  'FWH-Omega-02') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-02'; //then 'มทบ. 41'
//             if (transactionEa.site_name ==  'FWH-Omega-03') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-03'; //then 'ส.พัน.24ทภ.4'
//             if (transactionEa.site_name ==  'FWH-Omega-04') _dashboard = 'https://groundhog-wh.whsse.net/fwh-omega-04'; //then 'ร.15พัน.2'

            
            
//             // ─────────────────────────────────────────────────────────────────────────────



//             const reNewTransactionEa = {
//                 device_id: transactionEa.device_id ? transactionEa.device_id : null,
//                 id_elk: transactionEa.id_elk,
//                 pm2: transactionEa.pm2 ? transactionEa.pm2 : null,
//                 pm10: transactionEa.pm10 ? transactionEa.pm10 : null,
//                 site_name: transactionEa.site_name ? transactionEa.site_name : null,
//                 heat_index: _heat_index,
//                 coor: {
//                     lat: transactionEa.coor.lat ? transactionEa.coor.lat : 0,
//                     lon: transactionEa.coor.lon ? transactionEa.coor.lon : 0,
//                 },
//                 humidity: _humidity,
//                 temperature: _temp,
//                 Altitude: transactionEa.Altitude ? transactionEa.Altitude : null,
//                 Speed: transactionEa.Speed ? transactionEa.Speed : null,
//                 lightDetection: transactionEa.lightDetection ? transactionEa.lightDetection : null,
//                 noise: transactionEa.noise ? transactionEa.noise : null,
//                 carbondioxide: transactionEa.carbondioxide ? transactionEa.carbondioxide : null,
//                 battery: _battery,
//                 type: transactionEa.type ? transactionEa.type : null,
//                 date_type: transactionEa.date_data,
//                 date_data: moment().format().toString(),
//                 deviceList: transactionEa.deviceList,
//                 date_data7: transactionEa.date_data7,
//                 dashboard: _dashboard,

//             };
//             // console.log('reNewTransactionEa =:} ', JSON.stringify(reNewTransactionEa, null, 2));

//             //Axios Create──────────────────────────────────────────────────────────────────
//             await axios
//                 .put(url + id_elk, reNewTransactionEa, { auth })
//                 .then((results) => {
//                     // console.log('Result =:} ', JSON.stringify(results.data, null, 2));
//                 })
//                 .catch((error) => {
//                     console.log('Failed to fetch -> ', error);
//                 });

//             //Axios Update──────────────────────────────────────────────────────────────────
//             await axios
//                 .put(url2 + id_elkNew, reNewTransactionEa, { auth })
//                 .then((results) => {
//                     // console.log('Result =:} ', JSON.stringify(results.data, null, 2));
//                 })
//                 .catch((error) => {
//                     console.log('Failed to fetch -> ', error);
//                 });

//             if (!resultNoti) throw new Error('something went wrong try again later');

//             await this.lineNotifySend(createTransactionDto);

//             return ResStatus.success, 'Success', resultNoti;
//         } catch (err) {
//             console.error(`${tag} -> `, err);
//             this.logger.error(`${tag} -> `, err);
//             throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//     }
//     // ─────────────────────────────────────────────────────────────────────────────

//     async findOne(_id: string) {
//         let transaction: TransactionDB;
//         try {
//             transaction = await this.transactionModel.findById({ id: _id }, '-__v');
//         } catch (error) {
//             throw new InternalServerErrorException(error);
//         }

//         if (!transaction) {
//             throw new NotFoundException('User not found');
//         }

//         return new FindOneTransactionDTO(ResStatus.success, 'สำเร็จ', transaction);
//     }

//     async getDevicesBySiteName(site_name: string) {
//         const site = await this.transactionModel.findOne({ site_name: site_name }).populate('device_id', 'device_name');
//         return site;
//     }

//     // async sendImageNotification() {
//     //     try {
//     //         const formData = new FormData();
//     //         formData.append('message', message);
//     //         formData.append('imageThumbnail', IMAGE_URL);
//     //         formData.append('imageFullsize', IMAGE_URL);

//     //         axios.post('https://notify-api.line.me/api/notify', formData, {
//     //             headers: {
//     //                 ...formData.getHeaders(),
//     //                 'Authorization': `Bearer ${ACCESS_TOKEN}`
//     //             }
//     //         })
//     //             .then((response) => {
//     //                 console.log(response.data);
//     //             })
//     //             .catch((error) => {
//     //                 console.error(error);
//     //             });
//     //     }
//     // }

//     async getData() {
//         try {
//             const response = await axios.get('http://202.44.231.125:8089/es-get.php');
//             // console.log(response.data.hits.hits);
//             return response.data.hits.hits;
//         } catch (error) {
//             console.error(error);
//             return null;
//         }
//     }

//     async ispass_heat_index(heat_index: number) {
//         if (heat_index >= 40) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     async line_notify(message = 'test', IMAGE_URL = null) {
//         // console.log('====>', message);
//         const ACCESS_TOKEN = 'E9nsOwsLcOVNt2xTaaUf3KtVoCHqlVZn6WGnYEM9399';
//         // สร้าง form data และใส่ข้อมูลที่ต้องการส่งไปยัง LINE Notify
//         const formData = new FormData();
//         formData.append('message', message);
//         if (IMAGE_URL) {
//             formData.append('imageThumbnail', IMAGE_URL);
//             formData.append('imageFullsize', IMAGE_URL);
//         }

//         const response = await axios
//             .post('https://notify-api.line.me/api/notify', formData, {
//                 headers: {
//                     ...formData.getHeaders(),
//                     Authorization: `Bearer ${ACCESS_TOKEN}`,
//                 },
//             })
//     }

//     async notifyHeatIndex(message: string, IMAGE_URL: string, body = null) {
//         if (status_heat_index) {
//             // if(body){
//             //     console.log(body.heat_index, "Call")
//             // }
//             await this.line_notify(message, IMAGE_URL);
//             // console.log("++++++++++++++++++++++++++++++++++++")
//         }
//     }

//     async suggestionMessage(heat_index: any) {
//         let message = '';
//         if (heat_index > 50) {
//             message += `\n === ข้อแนะนำ === \n• ทำการฝึก 20 นาทีและพัก 40 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี) \n• รายละเอียด: https://groundhog.whsse.net \n• ${moment().add(543, 'years').locale('th').format('LLLL เวลา HH:mm')}`;
//         } else if (heat_index >= 40) {
//             message += `\n === ข้อแนะนำ === \n• ทำการฝึก 30 นาทีและพัก 30 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี) \n• รายละเอียด: https://groundhog.whsse.net \n• ${moment().add(543, 'years').locale('th').format('LLLL')}`;
//         } else if (heat_index >= 33) {
//             message += `\n === ข้อแนะนำ === \n• ทำการฝึก 45 นาทีและพัก 15 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่งลิตร (1000ซีซี) \n• รายละเอียด: https://groundhog.whsse.net \n• ${moment().add(543, 'years').locale('th').format('LLLL')}`;
//         } else if (heat_index >= 27) {
//             message += `\n === ข้อแนะนำ === \n• ทำการฝึก 50 นาทีและพัก 20 นาที ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่ง/สองลิตร (500ซีซี) \n• รายละเอียด: https://groundhog.whsse.net \n• ${moment().add(543, 'years').locale('th').format('LLLL')}`;
//         } else {
//             message += `\n === ข้อแนะนำ === \n• ทำการฝึกได้ต่อเนื่อง \n• ควรให้ผู้รับการฝึกดื่มน้ำอย่างน้อยชั่วโมงละหนึ่ง/สองลิตร (500ซีซี) \n• รายละเอียด : https://groundhog.whsse.net \n• ${moment().add(543, 'years').locale('th').format('LLLL')}`;
//         }
//         return message;
//     }

//     async defaultMessage(body: CreateTransactionDto) {
//         let message = ` \n === แจ้งเตือน === \n • ค่าดัชนีความร้อน ${body.heat_index} \n • จุดติดตั้ง ${body.site_name} \n • พิกัด: ${body.coor_lat} , ${body.coor_lon}
//         `
//         return message;
//     }

//     async messageHeatIndex(body: CreateTransactionDto) {
//         let heat_index = body.heat_index;
//         let message = '';
//         let IMAGE_URL = '';
//         if (heat_index > 50) {
//             message += (await this.defaultMessage(body)) + '' + (await this.suggestionMessage(heat_index));
//             IMAGE_URL += flag.black;
//         } else if (heat_index >= 40) {
//             message += (await this.defaultMessage(body)) + '' + (await this.suggestionMessage(heat_index));
//             IMAGE_URL += flag.red;
//         } else if (heat_index >= 33) {
//             message += (await this.defaultMessage(body)) + '' + (await this.suggestionMessage(heat_index));
//             IMAGE_URL += flag.yellow;
//         } else if (heat_index >= 27) {
//             message += (await this.defaultMessage(body)) + '' + (await this.suggestionMessage(heat_index));
//             IMAGE_URL += flag.green;
//         } else {
//             message += (await this.defaultMessage(body)) + '' + (await this.suggestionMessage(heat_index));
//             IMAGE_URL += flag.white;
//         }
//         return { message, IMAGE_URL };
//     }

//     async sendFromHeatIndex(body: CreateTransactionDto) {
//         console.log(body.heat_index);
//         // let message = '';
//         let ispass = await this.ispass_heat_index(body.heat_index);

//         if (ispass) {
//             let { message, IMAGE_URL } = await this.messageHeatIndex(body);
//             message += `${moment().add(543, 'years').locale('th').format(' debug =>> HH:mm:ss')}`;
//             await this.notifyHeatIndex(message, IMAGE_URL, body);
//             status_heat_index = false;
//         } else {
//             status_heat_index = true;
//         }

//         console.log(message); // แสดง message ใน console.log()

//         console.log(status_heat_index);
//     }

//     async checkHourCondition() {
//         const currentTime = moment().locale('th');
//         const hour = currentTime.hour();
//         console.log('Hour===>', hour);
//         if (currentTime.isBetween(moment('08:00', 'HH:mm'), moment('16:59', 'HH:mm'))) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     async checkDiffHour() {
//         const current = moment().locale('th');
//         const d = current.date();
//         const hour = current.hour();
//         console.log('date ==> ', d);
//         if (d == current_date) {
//             // current_hour = hour;
//             // status_hour = true;
//             if (currentTime.isBetween(moment('08:00', 'HH:mm'), moment('09:59', 'HH:mm'))) {
//                 if (!sendNotifyFlag[0]) {
//                     status_hour = true;
//                     sendNotifyFlag[0] = 1;
//                 }
//             } else if (currentTime.isBetween(moment('10:00', 'HH:mm'), moment('12:59', 'HH:mm'))) {
//                 if (!sendNotifyFlag[1]) {
//                     status_hour = true;
//                     sendNotifyFlag[1] = 1;
//                 }
//             } else if (currentTime.isBetween(moment('13:00', 'HH:mm'), moment('14:59', 'HH:mm'))) {
//                 if (!sendNotifyFlag[2]) {
//                     status_hour = true;
//                     sendNotifyFlag[2] = 1;
//                 }
//             } else if (currentTime.isBetween(moment('15:00', 'HH:mm'), moment('16:59', 'HH:mm'))) {
//                 if (!sendNotifyFlag[3]) {
//                     status_hour = true;
//                     sendNotifyFlag[3] = 1;
//                 }
//             }
//         } else {
//             current_date = d;
//             sendNotifyFlag = [0, 0, 0, 0, 0];
//         }
//     }

//     // async sendHourNotify(data: any, body: CreateTransactionDto) {
//     //     for (let index = 0; index < data.length; index++) {
//     //         const e = data[index];
//     //         let stationData = e._source;
//     //         let { message, IMAGE_URL } = await this.messageHeatIndex(stationData);
//     //         console.log('data', stationData.device_id);
//     //         await this.notifyHeatIndex(message, IMAGE_URL);
//     //     }
//     // }

//     async sendFromHour(body: any) {
//         const currentTime = moment().locale('th');
//         const hour = currentTime.hour();
//         let isPass = this.checkHourCondition();
//         let message = '';
//         if (isPass) {
//             this.checkDiffHour();
//             if (status_hour) {
//                 let data = await this.getData();
//                 this.sendHourNotify(data, body);
//                 status_hour = false;
//             }
//             // console.log(hour, '==>', status_hour);
//         }
//     }

//     async lineNotifySend(body: CreateTransactionDto) {
//         this.sendFromHeatIndex(body);
//         // this.sendFromHour(body);
//     }

//     // async exportToExcel(site_name: string, exportTime: Date): Promise<string> {
//     //     const workbook = new ExcelJS.Workbook();
//     //     const worksheet = workbook.addWorksheet('Transaction');

//     //     // กำหนด header
//     //     worksheet.columns = [
//     //         { header: 'date_data', key: 'date_data', width: 20 },
//     //         { header: 'site_name', key: 'site_name', width: 20 },
//     //         { header: 'temperature', key: 'temperature', width: 20 },
//     //         { header: 'humidity', key: 'humidity', width: 20 },
//     //         { header: 'heat_index', key: 'heat_index', width: 20 },
//     //         { header: 'pm2.5', key: 'pm2', width: 20 },
//     //     ];

//     //     // ค้นหาข้อมูลจากฐานข้อมูล
//     //     const transactions = await this.transactionModel.find({ site_name: site_name }).exec();

//     //     // กรอกข้อมูลลงใน Excel worksheet
//     //     transactions.forEach((transaction) => {
//     //         worksheet.addRow({
//     //             date_data: transaction.date_data,
//     //             site_name: transaction.site_name,
//     //             temperature: transaction.temperature,
//     //             humidity: transaction.humidity,
//     //             heat_index: transaction.heat_index,
//     //             pm2: transaction.pm2,
//     //         });
//     //     });

//     //     // สร้างไฟล์ Excel ในโฟลเดอร์ output และกำหนดชื่อไฟล์ตามวันที่และเวลาที่ส่งออก
//     //     const outputDir = './output';
//     //     const outputFilename = `Transaction_${exportTime.toLocaleString()}.xlsx`;
//     //     const outputPath = path.join(outputDir, outputFilename);
//     //     await fs.promises.mkdir(outputDir, { recursive: true });
//     //     await workbook.xlsx.writeFile(outputPath);

//     //     return outputPath;
// }
