import { Module } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { ComprobanteController } from './comprobante.controller';

@Module({
  controllers: [ComprobanteController],
  providers: [ComprobanteService],
})
export class ComprobanteModule {}
