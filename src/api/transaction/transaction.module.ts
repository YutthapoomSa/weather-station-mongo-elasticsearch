import { forwardRef, Module } from '@nestjs/common';
import { ShareModule } from 'src/share/share.module';
import { LineNotifyService } from '../line-notify/line-notify.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';


@Module({
    imports: [ShareModule, forwardRef(() => TransactionModule)],
    controllers: [TransactionController],
    providers: [TransactionService, LineNotifyService,],
    exports: [TransactionService],
})
export class TransactionModule {}
