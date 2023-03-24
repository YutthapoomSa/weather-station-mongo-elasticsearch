import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    collection: 'siteMapping',
    _id: true,
})
export class SiteMappingDB extends Document {
    
}

export const SiteMappingSchema = SchemaFactory.createForClass(SiteMappingDB);
