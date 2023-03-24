import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiteMappingService } from './site-mapping.service';
import { CreateSiteMappingDto } from './dto/create-site-mapping.dto';
import { UpdateSiteMappingDto } from './dto/update-site-mapping.dto';

@Controller('site-mapping')
export class SiteMappingController {
  constructor(private readonly siteMappingService: SiteMappingService) {}

  @Post()
  create(@Body() createSiteMappingDto: CreateSiteMappingDto) {
    return this.siteMappingService.create(createSiteMappingDto);
  }

  @Get()
  findAll() {
    return this.siteMappingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteMappingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteMappingDto: UpdateSiteMappingDto) {
    return this.siteMappingService.update(+id, updateSiteMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteMappingService.remove(+id);
  }
}
