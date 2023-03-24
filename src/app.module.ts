import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LogService } from './services/log.service';
import { ShareModule } from './share/share.module';
import { TransactionModule } from './api/transaction/transaction.module';
import { DeviceModule } from './api/device/device.module';
import { SiteMappingModule } from './api/site-mapping/site-mapping.module';


@Module({
    imports: [
        ShareModule,
        ConfigModule,
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
        }),
        UserModule,
        TransactionModule,
        DeviceModule,
        SiteMappingModule,

    ],
    controllers: [],
    providers: [LogService],
})
export class AppModule { }
