import { PartialType } from '@nestjs/swagger';
import { CreateReqDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateReqDeviceDto) {}
