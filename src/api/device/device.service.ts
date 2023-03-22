import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import { Model } from 'mongoose';
import { DeviceDB } from './../../entities/device.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateReqDeviceDto, CreateResDeviceDTO } from './dto/create-device.dto';
moment.tz.setDefault('Asia/Bangkok');

const lineNotify = require('line-notify-nodejs')('phz1Yp5FDCJ6ao9Yi7JRkFa3eB75VcXfMJ80nefhF3Z');
// const lineNotify = require('line-notify-nodejs')('d3K7eG2kRtKVOA7RYQqESarSUwqQHGCvBjgQInDWN0E');
const url = 'https://dbcd-171-100-8-238.ap.ngrok.io/weather-station/_doc/';
const username = 'elastic';
const password = 'P@ssw0rd2@22##';
const auth = {
    username: username,
    password: password,
};
const event = 'บันทึกข้อมูลจากอุปกรณ์สำเร็จ';

@Injectable()
export class DeviceService implements OnApplicationBootstrap {
    private logger = new LogService(DeviceService.name);

    constructor(
        @InjectModel(DeviceDB.name)
        private readonly deviceModel: Model<DeviceDB>,
    ) {}
    onApplicationBootstrap() {
        //
    }

    async checkDeviceMath(body: CreateReqDeviceDto) {
        const tag = this.create.name;
        try {
            const existingDevice = await this.deviceModel
                .findOne({
                    serialNumber: body.serialNumber,
                    device_name: body.device_name,
                })
                .exec();
            return Boolean(existingDevice);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createDeviceDto: CreateReqDeviceDto) {
        const tag = this.create.name;
        try {
            if (!createDeviceDto) throw new Error('Device is required !!');

            const id_elkDV = createDeviceDto.serialNumber
                ? String(createDeviceDto.serialNumber + moment().format('YYYYMMDDHHmmss'))
                : moment().format('YYYYMMDDHHmmss');
            console.log('id_elk ->', JSON.stringify(id_elkDV, null, 2));

            const mathExists = await this.checkDeviceMath(createDeviceDto);

            if (!mathExists) {
                const _create = new this.deviceModel();
                _create.id_elkDV = id_elkDV;
                _create.serialNumber = createDeviceDto.serialNumber;
                _create.device_name = createDeviceDto.device_name;
                const resultNoti = await _create.save();

                const deviceELK = _create;
                const createDeviceELK = {
                    id_elkDV: deviceELK.id_elkDV,
                    serialNumber: deviceELK.serialNumber,
                    device_name: deviceELK.device_name,
                };

                await axios
                    .put(url + id_elkDV, createDeviceELK, { auth })
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
                await this.lineNotifySend(event, createDeviceDto);
                return new CreateResDeviceDTO(ResStatus.success, 'Success', _create);
            }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async lineNotifySend(event: string, body: CreateReqDeviceDto) {
        try {
            lineNotify
                .notify({
                    message: `
                    \n serialNumber: ${body.serialNumber}
                    \n device_name.5: ${body.device_name}
                    \n Date_data: ${moment(Date.now()).format('DD-MM-YYYY | hh:mm:ss a')}
                    \n สถานะ: ${event}
                    \n เวลา : ${moment().locale('th').format('LLLL')}`,
                })
                .then(() => {
                    console.log('send completed!');
                });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
