import { Injectable } from '@nestjs/common';
import { CreateSiteMappingDto } from './dto/create-site-mapping.dto';
import { UpdateSiteMappingDto } from './dto/update-site-mapping.dto';

@Injectable()
export class SiteMappingService {
  create(createSiteMappingDto: CreateSiteMappingDto) {
    return 'This action adds a new siteMapping';
  }

  findAll() {
    return `This action returns all siteMapping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} siteMapping`;
  }

  update(id: number, updateSiteMappingDto: UpdateSiteMappingDto) {
    return `This action updates a #${id} siteMapping`;
  }

  remove(id: number) {
    return `This action removes a #${id} siteMapping`;
  }
}
