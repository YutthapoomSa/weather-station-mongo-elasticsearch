import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ShareModule } from 'src/share/share.module';
import { LineNotifyService } from '../line-notify/line-notify.service';

@Module({
    imports: [ShareModule, forwardRef(() => TransactionModule)],
    controllers: [TransactionController],
    providers: [TransactionService, LineNotifyService],
    exports: [TransactionService],
})
export class TransactionModule {}
