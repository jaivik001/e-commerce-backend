import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailError, EmailResult } from 'src/common/utils/string.constants';

@Injectable()
export class MailService {

  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: any, subject: string, template: string, context: any, attachments?:any) {
    let data = await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
      attachments
    }).catch(e => 
      console.error(MailError, e) 
    );
    // console.log(EmailResult, data)
    return data
  }
}
