import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DeviceDB } from './device.entity';
import { TransactionDB } from 'src/entities/transaction.entity';

@Schema({
    collection: 'siteMapping',
    _id: true,
})
export class SiteMappingDB extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: DeviceDB.name,
        required: true,
    })
    device_id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.String,
        ref: DeviceDB.name,
        required: true,
    })
    serialNumber: string;

    @Prop({
        type: MongooseSchema.Types.String,
        ref: TransactionDB.name,
        required: true,
    })
    site_name: string;
}

export const SiteMappingSchema = SchemaFactory.createForClass(SiteMappingDB);
