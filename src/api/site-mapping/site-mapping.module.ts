import { forwardRef, Module } from '@nestjs/common';
import { SiteMappingService } from './site-mapping.service';
import { SiteMappingController } from './site-mapping.controller';
import { ShareModule } from './../../share/share.module';

@Module({
    imports: [ShareModule, forwardRef(() => SiteMappingModule)],
    controllers: [SiteMappingController],
    providers: [SiteMappingService],
    exports: [SiteMappingService],
})
export class SiteMappingModule {}
