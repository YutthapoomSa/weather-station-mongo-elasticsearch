import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LineNotifyService {
  private readonly LINE_NOTIFY_API_URL = 'https://notify-api.line.me/api/notify';
  private readonly LINE_NOTIFY_TOKEN = 'ux4i5Q3xrfcdZpU0mmFuTfM2rxvDQNRG7Col8SOok9A'; // ใส่ Token ของคุณที่นี่

  constructor(private readonly httpService: HttpService) {}

  async sendLineNotify(message: string): Promise<any> {
    const headers = { Authorization: `Bearer ${this.LINE_NOTIFY_TOKEN}` };
    const payload = { message };
    return this.httpService.post(this.LINE_NOTIFY_API_URL, payload, { headers }).toPromise();
  }
}
