import { BadRequestException, Injectable } from '@nestjs/common';
import { Factura } from './facturaPlantilla';
const path = require('path');
const fs = require("fs");
const { execSync } = require('node:child_process');
const axios = require('axios');
var nodemailer = require('nodemailer');

@Injectable()
export class ComprobanteService {

  async firmarComprobante( info ){

    const base_url_signedurl = 'https://74v4865l13.execute-api.us-east-1.amazonaws.com/dev/signedurl';   
    const java = process.env.JAVA_PATH;
    const passCertificado = info.pass_certificado;
    const arrayRutaCertificado = info.certificado.split('/')
    const nameCertificado = arrayRutaCertificado[ arrayRutaCertificado.length - 1 ];
    
    const pathDir = path.resolve(__dirname, `../../static/SRI`);
    const url = info.certificado; 
    const localFilePath = `${ pathDir }/Firmas/${ nameCertificado }`; 

    //DESCARGAR FIRMA DE LA EMPRESA
    const { data } = await axios({ method: 'get', url, responseType: 'arraybuffer' }) 

    await fs.writeFileSync(localFilePath, Buffer.from( data ));
    
    await fs.mkdirSync(path.dirname(`${ pathDir }/Generados/${ info.clave_acceso }.xml`), {recursive: true, });
    await fs.writeFileSync(`${ pathDir }/Generados/${ info.clave_acceso }.xml`, info.xml, {flag: 'w+', encoding: 'utf-8'});

    await fs.mkdirSync(path.dirname(`${ pathDir }/Firmados/${ info.clave_acceso }.xml`), {recursive: true})
    await fs.writeFileSync(`${ pathDir }/Firmados/${ info.clave_acceso }.xml`, "", {flag: 'w+', encoding: 'utf-8'})
    
    const cmd = java + ' -jar "' + path.resolve('static/resource/jar/firmaxml1 (1).jar') + '" "' + `${ pathDir }/Generados/${ info.clave_acceso }.xml` + '" "' + localFilePath + '" "' + passCertificado + '" "' + `${ pathDir }/Firmados/${ info.clave_acceso }.xml` + '"';

    //FIRMAR Y ENVIAR BUFFER DEL XML FIRMADO
    try {
      
      await execSync(cmd);

      const xmlOut = await fs.readFileSync(`${ pathDir }/Firmados/${ info.clave_acceso }.xml`);

      //Guardar XML Firmado al bucket de Amazon
      const { data } = await axios.get(`${ base_url_signedurl }`, { 
        params: { path: 'xmlFirmados', filename: `${ info.clave_acceso }.xml` } 
      });      
      await fetch(data.signedUrl, { method: 'PUT', body: xmlOut });

      //Eliminar Archivos
      await fs.unlinkSync(`${ pathDir }/Firmados/${ info.clave_acceso }.xml`);
      await fs.unlinkSync(`${ pathDir }/Generados/${ info.clave_acceso }.xml`);
      await fs.unlinkSync(`${ pathDir }/Firmas/${ nameCertificado }`);
      
      return xmlOut.toString('base64');

    } catch (err) {
      return console.log('error firma: ', err)
    }
  }

  async getRidePdf( data, url_image ){
    const factura = new Factura();
    const bufferPDF = await factura.generarFacturaPDF( data, url_image );
    return bufferPDF;
  }

  async enviarEmail( data ){

      let url_image;
      if ( data.empresa.logo != null || data.empresa.logo) {
        const resp = await axios({ method: 'get', url: `${ data.empresa.logo }` }) 
        url_image = resp.data;      
      }else{
        url_image = `${ process.env.URL_SERVER }/default.jpg`;     
      }

      const buffer = await this.getRidePdf( data, url_image );

      const config = {
        host: process.env.HOST,
        port: +process.env.PUERTO,
        secure: +process.env.PUERTO === 465 ? true : false,
        greetingTimeout: 12000,
        connectionTimeout: 12000,
        dnsTimeout: 12000,
        auth: { user: process.env.USUARIO, pass: process.env.PASSWORD }
      }
  
      let message: any = {
        from: process.env.USUARIO,
        to: `${ data.cliente.email }`
      }
  
      message.subject = `${ data.empresa.nombre.toUpperCase() } - Factura Nro. ${ data.factura.num_comprobante }`,
      message.text    = `${ data.empresa.nombre.toUpperCase() } agradece su compra :)`,      
      message.attachments = [
        { filename: `${ data.factura.clave_acceso }.pdf`, content: buffer }
      ]      
  
      const transport = nodemailer.createTransport(config);
  
      try {
          await transport.sendMail(message);
          return "Correo Enviado Exitosamente";      
      } catch (error) {
        console.log( error );
        if ( error.code == 'EDNS' ) 
          throw new BadRequestException(`Error: getaddrinfo ENOTFOUND -----`);        
        else
          throw new BadRequestException('Fallo al enviar el correo');        
      }     
  }

  async enviarCotizacion( data ){

    let url_image;
    if ( data.cliente.empresa.logo != null || data.cliente.empresa.logo) {
      const resp = await axios({ method: 'get', url: `${ data.cliente.empresa.logo }` }) 
      url_image = resp.data;      
    }else{
      url_image = `${ process.env.URL_SERVER }/default.jpg`;     
    }

    const factura = new Factura();
    const buffer = await factura.generarCotizacionPDF( data, url_image );

    const config = {
      host: process.env.HOST,
      port: +process.env.PUERTO,
      secure: +process.env.PUERTO === 465 ? true : false,
      greetingTimeout: 12000,
      connectionTimeout: 12000,
      dnsTimeout: 12000,
      auth: { user: process.env.USUARIO, pass: process.env.PASSWORD }
    }

    let message: any = {
      from: process.env.USUARIO,
      to: `${ data.cliente.persona.email }`
    }

    message.subject = `${ data.cliente.empresa.nombre_comercial.toUpperCase() } - le envia su cotización`,
    message.text    = `${ data.cliente.empresa.nombre_comercial.toUpperCase() } - agradece su consulta `,      
    message.attachments = [
      { filename: `cotizacion.pdf`, content: buffer }
    ]      

    const transport = nodemailer.createTransport(config);

    try {
        await transport.sendMail(message);
        return "Correo Enviado Exitosamente";      
    } catch (error) {
      console.log( error );
      if ( error.code == 'EDNS' ) 
        throw new BadRequestException(`Error: getaddrinfo ENOTFOUND -----`);        
      else
        throw new BadRequestException('Fallo al enviar el correo');        
    }     
  }

}
