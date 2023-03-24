import { PartialType } from '@nestjs/swagger';
import { CreateSiteMappingDto } from './create-site-mapping.dto';

export class UpdateSiteMappingDto extends PartialType(CreateSiteMappingDto) {}
