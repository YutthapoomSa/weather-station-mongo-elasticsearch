import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import moment from 'moment';
import { ObjectId } from 'mongoose';
import { EnumType } from 'src/entities/transaction.entity';

export class deviceData {
    @ApiProperty()
    @IsString()
    serialNumber: string;
    @ApiProperty()
    @IsString()
    device_name: string;
}
// export class CreatTransactionReqDTO {
//     @ApiProperty()
//     @IsNumber()
//     pm2: number;

//     @ApiProperty()
//     @IsString()
//     site_name: string;

//     @ApiProperty()
//     @IsNumber()
//     heat_index: number;

//     @ApiProperty()
//     @IsNumber()
//     coor_lat: number;

//     @ApiProperty()
//     @IsNumber()
//     coor_lon: number;

//     @ApiProperty()
//     @IsNumber()
//     humidity: number;

//     @ApiProperty()
//     @IsNumber()
//     temperature: number;

//     @ApiProperty()
//     @IsNumber()
//     battery: number;

//     @ApiProperty()
//     @IsString()
//     date_data: string;

//     @ApiProperty({
//         enum: Object.keys(EnumType).map((k) => EnumType[k]),
//     })
//     @IsString()
//     type: EnumType;

//     @ApiProperty({
//         type: [deviceData],
//     })
//     deviceList: deviceData[];
// }
export class CreateTransactionDto {
    @ApiProperty()
    @IsOptional()
    device_id: string;
    //--Todo add device array

    @ApiProperty()
    @IsNumber()
    pm2: number;

    @ApiProperty()
    @IsNumber()
    pm10: number;

    @ApiProperty()
    @IsString()
    site_name: string;

    @ApiProperty()
    @IsNumber()
    heat_index: number;

    @ApiProperty()
    @IsNumber()
    coor_lat: number;

    @ApiProperty()
    @IsNumber()
    coor_lon: number;

    @ApiProperty()
    @IsNumber()
    humidity: number;

    @ApiProperty()
    @IsNumber()
    temperature: number;

    @ApiProperty()
    @IsNumber()
    Altitude: number;

    @ApiProperty()
    @IsNumber()
    Speed: number;

    @ApiProperty()
    @IsNumber()
    lightDetection: number;

    @ApiProperty()
    @IsNumber()
    noise: number;

    @ApiProperty()
    @IsNumber()
    carbondioxide: number;

    @ApiProperty()
    @IsNumber()
    battery: number;

    @ApiProperty()
    @IsString()
    date_data: string;

    @ApiProperty({
        enum: Object.keys(EnumType).map((k) => EnumType[k]),
    })
    @IsString()
    type: EnumType;

    @ApiProperty({
        type: [deviceData],
    })
    deviceList: deviceData[];
}

export class CreateResTransactionData {
    @ApiProperty()
    id: string;

    @ApiProperty()
    device_id: ObjectId;

    @ApiProperty()
    id_elk: string;

    @ApiProperty()
    pm2: string;

    @ApiProperty()
    pm10: string;

    @ApiProperty()
    site_name: string;

    @ApiProperty()
    heat_index: number;

    @ApiProperty()
    coor_lat: number;

    @ApiProperty()
    coor_lon: number;

    @ApiProperty()
    humidity: string;

    @ApiProperty()
    temperature: string;

    @ApiProperty()
    Altitude: string;

    @ApiProperty()
    Speed: string;

    @ApiProperty()
    lightDetection: string;

    @ApiProperty()
    noise: string;

    @ApiProperty()
    carbondioxide: string;

    @ApiProperty()
    battery: string;

    @ApiProperty({
        enum: Object.keys(EnumType).map((k) => EnumType[k]),
    })
    type: EnumType;

    @ApiProperty({ example: moment().tz('Asia/Bangkok').format('DD MMM YYYY, HH:mm:ss') })
    date_data: string;
}

// export class CreateResTransaction {
//     @ApiProperty({
//         enum: Object.keys(ResStatus).map((k) => ResStatus[k]),
//         description: 'รหัสสถานะ',
//     })
//     resCode: ResStatus;

//     @ApiProperty({
//         type: () => CreateResTransactionData,
//         description: 'ข้อมูล',
//     })
//     resData: CreateResTransactionData;

//     @ApiProperty({
//         description: 'ข้อความอธิบาย',
//     })
//     msg: string;

//     constructor(resCode: ResStatus, msg: string, datas: TransactionDB) {
//         this.resCode = resCode;
//         this.msg = msg;
//         this.resData = new CreateResTransactionData();
//         const id_elk = datas.device_id + moment().format('YYYYMMDDHHmmss');

//         if (!!datas) {
//             this.resData.id = datas._id;
//             this.resData.device_id = datas.device_id;
//             this.resData.id_elk = id_elk;
//             this.resData.pm2 = String(`${datas.pm2} ug/m3`);
//             this.resData.pm10 = String(`${datas.pm10} ug/m3`);
//             this.resData.site_name = datas.site_name;
//             this.resData.heat_index = datas.heat_index;
//             this.resData.coor_lat = datas.coor.lat;
//             this.resData.coor_lon = datas.coor.lon;
//             this.resData.humidity = String(`${datas.humidity} %`);
//             this.resData.temperature = String(`${datas.temperature} °C`);
//             this.resData.Altitude = String(`${datas.Altitude} feet`);
//             this.resData.Speed = String(`${datas.Speed} km / h`);
//             this.resData.carbondioxide = String(`${datas.carbondioxide} ppm`);
//             this.resData.lightDetection = String(`${datas.lightDetection} lux`);
//             this.resData.noise = String(`${datas.noise} dB`);
//             this.resData.battery = String(`${datas.battery} %`);
//             this.resData.date_data = datas.date_data;
//         }
//     }
// }
