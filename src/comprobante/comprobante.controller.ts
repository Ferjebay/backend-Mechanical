import { Controller, Post, Body, Request, Res } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';

@Controller('comprobante')
export class ComprobanteController {
  constructor(private readonly comprobanteService: ComprobanteService) {}

  @Post('/firmar')
  async firmaComprobante( 
    @Body() data: any,
    @Res() res 
  ){
    const signedXmlsignedXml = await this.comprobanteService.firmarComprobante( data );

    res.setHeader('Content-Type', 'text/plain');
    res.send(signedXmlsignedXml);
  }

  @Post('/getRidePdf')
  getRidePdf( @Body() data: any ){
    this.comprobanteService.getRidePdf( data, `${ process.env.URL_SERVER }/default.jpg` );
  }

  @Post('/enviarEmail')
  enviarEmail( @Body() data: any ){
    this.comprobanteService.enviarEmail( data );
  }

  @Post('/enviarCotizacion')
  enviarCotizacion( @Body() data: any ){
    this.comprobanteService.enviarCotizacion( data );
  }

  @Post('/reenviarComprobantes')
  reenviarComprobantes( @Body() data: any ){
    this.comprobanteService.reenviarComprobantes( data );
  }

}
