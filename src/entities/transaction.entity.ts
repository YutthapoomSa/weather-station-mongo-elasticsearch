import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DeviceDB } from './device.entity';

@Schema({
    collection: 'transaction',
    _id: true,
})
export class TransactionDB extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: DeviceDB.name,
        required: true,
    })
    device_id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.String,
        required: false,
    })
    id_elk: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    pm2: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    pm10: number;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    site_name: string;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    heat_index: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    humidity: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    temperature: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    Altitude: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    Speed: number;

    @Prop({
        type: {
            lat: { type: MongooseSchema.Types.Number },
            lon: { type: MongooseSchema.Types.Number },
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
        required: true,
    })
    lightDetection: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    noise: number;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    carbondioxide: number;

    @Prop({
        type: MongooseSchema.Types.Number,
        required: true,
    })
    battery: number;
    
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDB);
