const puppeteer = require('puppeteer')
const moment = require('moment');

export class Factura {

    plantilla( data, url_image ){
        const fechaEmision = moment().format('DD/MM/YYYY h:mm:ss a');

        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Document</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
            <style>
              .backColor{
                background-color: #d5d7d9;
              }
              .borderTrBottom{
                padding-top: 5px;
                padding-bottom: 5px;
                border-bottom: 1px #dadae3 solid;
              }
            </style>
        </head>
        <body style="font-size: 15px; color: black;">
          <div class="row">
        
            <div class="col-6">
              <div class="mt-3 d-flex justify-content-center">
                <img src="${ url_image }" 
                style="max-width: 140px;height: auto;" class="rounded">
              </div>
              <div class="mt-1 backColor pt-1" style="padding-bottom: 92px;">
                <div style="padding-left: 13px">
                  <label class="d-block">
                    <span class="fw-bolder">Emisor:</span>
                    ${ data.empresa.nombre.toUpperCase() }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">RUC:</span>
                    ${ data.empresa.ruc }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">Matriz:</span>
                    ${ data.empresa.direccion }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">Correo:</span>
                    ${ data.empresa.correo }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">Teléfono:</span>
                    ${ data.empresa.telefono }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">Obligado a llevar contabilidad:</span>
                    ${ data.empresa.obligado_contabilidad ? 'SI' : 'NO' }
                  </label>
                  <label class="d-block">
                    <span class="fw-bolder">CONTRIBUYENTE RÉGIMEN RIMPE</span>            
                  </label>
                </div>
              </div>
            </div>
        
            <div class="col-6">
              <div class="row">
        
                <div class="col-12 backColor" style="height: 30px;">
                </div>
        
                <div class="col-12 d-flex align-items-center
                  justify-content-between fw-bold" 
                  style="height: 30px;">
                  <label>FACTURA</label>
                  <label>No. ${ data.factura.num_comprobante }</label>
                </div>
        
                <div class="mt-1 backColor py-4">
                  <div>
                    <label class="fw-bolder">
                      Número de Autorización:
                    </label>
                    <label style="font-size: 13px;">
                    ${ data.factura.clave_acceso }
                    </label>  
                  </div>
                  <div class="mt-3">
                    <label class="fw-bolder d-block">
                      Fecha y hora de Autorización:
                    </label>
                    <label>${ fechaEmision }</label>            
                  </div>
                  <div class="mt-3">
                    <label class="d-block">
                      <span class="fw-bolder">Ambiente:</span> 
                      ${ data.factura.ambiente == 'DEV' ? 'PRUEBAS' : 'PRODUCCIÓN' }
                    </label>
                    <label class="d-block">
                      <span class="fw-bolder">Emisión:</span> NORMAL
                    </label>
                    <label class="d-block">
                      <span class="fw-bolder">
                        Clave de Acceso:
                      </span> 
                      <div class="d-flex justify-content-center">
                        <svg id="barcode"></svg>
                      </div>
                    </label>
                  </div>
                </div>
        
              </div>
            </div>
        
            <div class="col-12 pb-3 backColor">
              <div class="row" style="padding-left: 13px;padding-right: 13px;">
                <div class="col-12 d-flex justify-content-between">
                  <label>
                    <span class="fw-bolder">Razón Social:</span>
                    ${ data.cliente.nombres }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">RUC/CI:</span>
                    ${ data.cliente.num_doc }
                  </label>
                </div>
                <div class="col-12 d-flex justify-content-between py-2">
                  <label>
                    <span class="fw-bolder">Dirección:</span>
                    ${ data.cliente.direccion }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">Teléfono:</span>
                    ${ data.cliente.telefono }
                  </label>
                </div>
                <div class="col-12 d-flex justify-content-between">
                  <label>
                    <span class="fw-bolder">Fecha Emisión:</span>
                    ${ moment().format('DD/MM/YYYY') }
                  </label>
                  <label style="width: 42%;">
                    <span class="fw-bolder">Correo:</span>
                    ${ data.cliente.email }
                  </label>
                </div>
              </div>
            </div>
        
            <div class="col-12 pt-5 pb-4" style="padding-top: 15px !important;">
              <table style="width: 100%;font-size: 13px;">
                <thead class="backColor">
                  <tr>
                    <th class="text-center" style="width: 10.2%;">
                      Código Principal
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Cantidad
                    </th>
                    <th class="text-center" style="width: 22.2%;">
                      Descripción
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Detalles Adicionales
                    </th>
                    <th class="text-center" style="width: 10.2%;">
                      Precio Unitario
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Descuento
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>`

                data.productos.forEach(item => {
                  html += `
                    <tr class="text-center borderTrBottom">
                        <td>${ item.codigoBarra }</td>
                        <td>${ item.cantidad }</td>
                        <td>${ item.nombre.toUpperCase() }</td>
                        <td></td>
                        <td>$${ item.pvp }</td>
                        <td>${ item.descuento }%</td>
                        <td>$${ item.pvp }</td>
                    </tr>`
                })
                  
              html += `
                </tbody>
              </table>
            </div>             
            <div class="col-6">
              <div class="row">        
                <div class="col-12 backColor fs-6 fw-medium" 
                  style="height: 30px;padding-left: 25px;">
                  Información Adicional
                </div>
                <div class="col-12" 
                  style="height: 30px;padding-left: 25px;">
        
                  <label class="fw-semibold pt-3">
                    
                  </label>
                  <label style="padding-left: 14px;">
                    
                  </label>
                </div>
        
                <div class="col-12 backColor fs-6 fw-medium mt-4" 
                  style="height: 30px;padding-left: 25px;">
                  Formas de pago
                </div>
        
                <div class="col-12" 
                  style="height: 30px;padding-left: 25px;">
        
                  <label class="fw-semibold pt-3" 
                    style="width: 55%;">
                    Sin Utilización del Sistema Financiero 
                  </label>
                  <label style="width: 15%;text-align: center;">
                  $${ data.factura.total.toFixed(2) }
                  </label>
                  <label style="width: 27%;text-align: right;">
                    0 días
                  </label>
                </div>
              </div>
            </div>
        
            <div class="col-6">
              <div class="row" style="text-align: right;font-size: 14px;">
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal Sin Impuestos:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  $${ data.factura.subtotal.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal 12%:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  $${ data.factura.subtotal.toFixed(2) }  
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal 0%: 
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    $0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Subtotal No Objeto IVA:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    $0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Descuentos:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  $${ data.factura.descuento.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    ICE:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    $0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    IVA 12%:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  $${ data.factura.iva.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Servicio %:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                    $0.00
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label style="padding-left: 50px;">
                    Valor Total:
                  </label>
                  <label class="backColor pe-3" style="width: 32%;">
                  $${ data.factura.total.toFixed(2) }
                  </label>
                </div>
              </div>
            </div>        
          </div>
          <script>
            JsBarcode("#barcode", 
              '57483994859485748392839485947560028384728', 
              {
                format: "CODE128",
                height: 70,
                width: 1,
                fontSize: 11,
                margin: 5,
                background: '#d5d7d9'
              });
          </script>
        </body>
        </html>`
        return html;
    }

    cotizacion( data, url_image ){
        const fechaEmision = moment().subtract(5, 'hours').format('DD/MM/YYYY h:mm:ss a');
        const fechaVencimiento = moment().subtract(5, 'hours').add(5, 'days').format('DD/MM/YYYY');

        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Document</title>
            <style>
              .backColor{
                background-color: #d5d7d9;
              }
              .borderTrBottom{
                padding-top: 5px;
                padding-bottom: 5px;
                border-bottom: 1px #dadae3 solid;
              }
              
              .tableProduct {
                  border-collapse: collapse;
              }
              
              .tableProduct,
              .tableProduct th,
              .tableProduct td {
                  border: 1px solid #d3cbcb;
              }
              
              .tableProduct th,
              .tableProduct td {
                  padding: 5px;
              }
            </style>
        </head>
        <body style="font-size: 15px; color: black;">
          <div class="row">
        
            <div class="col-5 pt-4 pb-2" 
              style="font-size: 9px;line-height: 15px;">
              <div class="d-flex justify-content-center">
                <img src="${ url_image }" 
                style="max-width: 120px;height: auto;" class="rounded">
              </div>
              <div class="d-flex justify-content-center mt-1 fw-bolder">
                ${ data.cliente.empresa.razon_social }
              </div>
              <div class="d-flex justify-content-center">
                R.U.C - ${ data.cliente.empresa.ruc }
              </div>
              <div class="d-flex justify-content-center">
                <div style="width: 65%;text-align: center;">
                ${ data.direccion_sucursal }
                </div>
              </div>
              <div class="d-flex justify-content-center">
                Tel - ${ data.cliente.empresa.telefono }
              </div>
              <div class="d-flex justify-content-center">
                ${ data.cliente.empresa.direccion_matriz } - Ecuador
              </div>
            </div>    
            <div class="col-7 pt-4 pb-2 d-flex align-items-center">
              <table style="text-align: end;border: 1px #dbdbdb solid;font-size: 11px;width: 100%">
                <tr>
                  <td class="fw-bolder"
                   style="width: 29%;background-color: #d3d9df;padding-right: 10px;">
                    Para:
                  </td>
                  <td style="padding-right: 10px;">
                    ${ data.cliente.persona.nombres } ${ data.cliente.persona.apellidos }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                    style="background-color: #d3d9df;padding-right: 10px;text-transform: capitalize;">
                    ${ data.cliente.persona.tipo_documento }:
                  </td>
                  <td style="padding-right: 10px;">
                    ${ data.cliente.persona.num_documento }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                    style="background-color: #d3d9df;padding-right: 10px;text-transform: capitalize;">
                    Email:
                  </td>
                  <td style="padding-right: 10px;">
                    ${ data.cliente.persona.email }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                   style="background-color: #d3d9df;padding-right: 10px;">
                    Fecha Emisión:
                  </td>
                  <td style="padding-right: 10px;">
                    ${ fechaEmision }
                  </td>
                </tr>
                <tr>
                  <td class="fw-bolder"
                  style="background-color: #d3d9df;padding-right: 10px;">
                    Válido Hasta:
                  </td>
                  <td style="padding-right: 10px;">
                    ${ fechaVencimiento }
                  </td>
                </tr>
              </table>
            </div>    
        
            <div class="col-12 pb-1 mt-2 text-center fw-semibold fs-5" style="font-size: 13px;">
              COTIZACIÓN
            </div>
        
            <div class="col-12 pt-1 pb-2 mt-1" 
              style="font-size: 11px;">
              <table class="tableProduct" style="width: 100%;">
                <thead style="background-color: #d3d9df;">
                  <tr>
                    <th class="text-center" style="width: 5.2%;">
                      Item
                    </th>
                    <th class="text-center" style="width: 14.2%;">
                      Producto
                    </th>
                    <th class="text-center" style="width: 44.2%;">
                      Descripción
                    </th>
                    <th class="text-center" style="width: 8.2%;">
                      Cantidad
                    </th>
                    <th class="text-center" style="width: 10.2%;">
                      Impto. Cargo
                    </th>
                    <th class="text-center" style="width: 8.2%;">
                      Vr. Unitario 
                    </th>
                    <th class="text-center" style="width: 9.2%;">
                      Vr. total
                    </th>
                  </tr>
                </thead>
                <tbody>`
                
                data.datosFactura.products.forEach((product, index) => {
                html += `
                  <tr class="text-center">
                    <td>${ index + 1 }</td>
                    <td>${ product.codigoBarra }</td>
                    <td>${ product.nombre }</td>
                    <td>1</td>
                    <td>12%</td>
                    <td>${ parseFloat(product.pvp).toFixed(2) }</td>
                    <td>${ parseFloat(product.pvp).toFixed(2) }</td>
                  </tr>`                
              });
                
                html +=`
                </tbody>
              </table>
            </div>  
            
            <div class="col-7"></div>
        
            <div class="col-5" style="font-size: 12px;">
              <div class="row" style="text-align: right;">
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Total Bruto:
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ data.datosFactura.subtotal.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Descuentos:
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ data.datosFactura.descuento.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-2 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Subtotal: 
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ (data.datosFactura.subtotal - data.datosFactura.descuento).toFixed(2) }
                  </label>
                </div>
                <div class="col-12 pb-1 d-flex justify-content-between">
                  <label class="fw-bolder"
                    style="padding-left: 50px;">
                    Total IVA: 
                  </label>
                  <label class="pe-3" style="width: 46%;">
                    $${ data.datosFactura.iva.toFixed(2) }
                  </label>
                </div>
                <div class="col-12 py-1 backColor pb-1 d-flex justify-content-between fw-bold">
                  <label style="padding-left: 50px;">
                    Total a pagar: 
                  </label>
                  <label class="backColor pe-3" style="width: 46%;">
                    $${ data.datosFactura.total.toFixed(2) } USD
                  </label>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>`
        return html;
    }

    async generarFacturaPDF( data, url_image ){

      const content = this.plantilla( data, url_image );
  
      let browser;
      if (process.env.SISTEMA == 'linux') {
        browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] });        
      }else{
        browser = await puppeteer.launch({ headless: true })
      }

      const page = await browser.newPage()
  
      await page.setContent(content);
  
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          left: '20px',
          top: '0px',
          right: '20px',
          bottom: '0px'
        }
      })
  
      await browser.close();

      return pdfBuffer;
    }

    async generarCotizacionPDF( data, url_image ){

      const content = this.cotizacion( data, url_image );
  
      let browser;
      if (process.env.SISTEMA == 'linux') {
        browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] });        
      }else{
        browser = await puppeteer.launch({ headless: true })
      }

      const page = await browser.newPage()
  
      await page.setContent(content);
  
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          left: '20px',
          top: '0px',
          right: '20px',
          bottom: '0px'
        }
      })
  
      await browser.close();

      return pdfBuffer;
    }
}
