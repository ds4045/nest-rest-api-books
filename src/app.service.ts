import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcome() {
    return 'This rest api make by ds4045,please follow the url to study the documentation /swagger';
  }
}
