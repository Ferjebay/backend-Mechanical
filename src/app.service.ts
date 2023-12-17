import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {

  async handleCron(  ){
    console.log("Hola Mundo");
  }

}
