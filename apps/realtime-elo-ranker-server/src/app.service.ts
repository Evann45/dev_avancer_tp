import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  private data: String[];

  constructor() {
    this.data = [];
  }

  getHello(): string {
    return 'Hello World!';
  }

  addData(data: String) {
    this.data.push(data);
  }

  getData() {
    return this.data;
  }
}
