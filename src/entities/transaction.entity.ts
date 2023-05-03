import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DeviceDB } from './device.entity';

export enum EnumType {
    indoor = 'indoor',
    outdoor = 'outdoor',
    airStation = 'airStation',
}

@Schema({
    collection: 'transaction',
    _id: true,
})
export class TransactionDB extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: DeviceDB.name,
        required: false,
        allownull: true,
        default: null,
    })
    device_id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    id_elk: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    pm2: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    pm10: number;

    @Prop({
        type: MongooseSchema.Types.String,
        allownull: true,
        required: false,
    })
    site_name: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    heat_index: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    humidity: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    temperature: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    Altitude: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    Speed: number;

    @Prop({
        type: {
            lat: { type: MongooseSchema.Types.Number, allownull: true },
            lon: { type: MongooseSchema.Types.Number, allownull: true },
        },
        _id: false,
    })
    coor: {
        lat: number;
        lon: number;
    };

    @Prop({
        type: MongooseSchema.Types.String,
    })
    date_data: string;

    @Prop({
        type: MongooseSchema.Types.String,
    })
    date_data7: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    lightDetection: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    noise: number;

    @Prop({
        type: MongooseSchema.Types.String,
        allownull: true,
        required: false,
    })
    carbondioxide: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        allownull: true,
        required: false,
    })
    battery: number;

    @Prop({
        enum: Object.keys(EnumType).map((k) => EnumType[k]),
        allownull: true,
        required: false,
    })
    type: EnumType;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: DeviceDB.name }],
        allownull: true,
        required: false,
        _id: false,
    })
    deviceList: DeviceDB[];
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDB);
