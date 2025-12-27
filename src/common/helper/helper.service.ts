import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';

@Injectable()
export class HelperService {
  constructor() { }

  isNotEmpty(value: any) {
    return ((value != '') && (value != undefined) && (value != null))
  }

  async generateOTP() {
    return crypto.randomInt(1000, 10000).toString();
  }
}