import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import moment from 'moment';
import { LogService } from './../../services/log.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { TransactionDB } from 'src/entities/transaction.entity';
moment.tz.setDefault('Asia/Bangkok');
@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    private logger = new LogService(TransactionController.name);

    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    @ApiOperation({ summary: 'สร้างข้อมูล Transaction' })
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return await this.transactionService.create(createTransactionDto);
    }

    // @Get('/getTransactionById/:id')
    // // @ApiBearerAuth()
    // // @UseGuards(AuthGuard('jwt'))
    // async getCompanyById(@Param('id') id: string) {
    //     return await this.transactionService.findOne(`${id}`);
    // }

    // @Get(':site_name')
    // async getDevicesBySiteName(@Param('site_name') site_name: string) {
    //     const devices = await this.transactionService.getDevicesBySiteName(site_name);
    //     return { devices };
    // }

    @Get('/export/:site_name')
    async exportToExcel(
        @Param('site_name') siteName: string,
        @Query('date_date') dateString: string,
        @Res() res: Response,
    ) {
        // Parse date string into a Moment object
        const date = moment.tz(dateString, 'DD-MM-YYYY');
        if (!date.isValid()) {
            return res.status(400).send({ message: 'Invalid date format' });
        }

        // Retrieve transactions for the specified site and date
        const buffer = await this.transactionService.exportToExcel(
            siteName,
            date.toDate(),
        );

        // Set response headers to trigger download of file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=transactions_${siteName}_${date.format('YYYY-MM-DD')}.xlsx`,
        );

        // Pipe the Excel workbook buffer to the response object
        res.status(200).send(buffer);
    }
}