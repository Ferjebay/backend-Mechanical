import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ComprobanteModule } from './comprobante/comprobante.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),

    ScheduleModule.forRoot(),

    ComprobanteModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
