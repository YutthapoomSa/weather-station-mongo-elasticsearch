import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogService } from './../../services/log.service';
import { CreateTransactionDto, deviceData } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { LineNotifyService } from '../line-notify/line-notify.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    private logger = new LogService(TransactionController.name);

    constructor(private readonly transactionService: TransactionService,private readonly lineNotifyService: LineNotifyService) {}

    @Post()
    @ApiOperation({ summary: 'สร้างข้อมูล Transaction' })
    // @ApiOkResponse({ type: CreateResTransaction })
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionService.create(createTransactionDto);
    }

    // @Post('createTransactionOmega')
    // @ApiOperation({ summary: 'สร้างข้อมูล TransactionOmega' })
    // // @ApiOkResponse({ type: CreateResTransaction })
    // async createOmega(@Body() createTransactioReqnDto: CreatTransactionReqDTO, deviceData: deviceData) {
    //     return await this.transactionService.createOmega(createTransactioReqnDto, deviceData);
    // }

    @Get('/getTransactionById/:id')
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'))
    async getCompanyById(@Param('id') id: string) {
        return await this.transactionService.findOne(`${id}`);
    }

    @Get(':site_name')
    async getDevicesBySiteName(@Param('site_name') site_name: string) {
        const devices = await this.transactionService.getDevicesBySiteName(site_name);
        return { devices };
    }

    // @Get(':site_name')
    // async getTransactionsBySiteName(@Param('site_name') site_name: string) {
    //     return this.transactionService.getAllDevicesBySiteName(site_name);
    // }
}
