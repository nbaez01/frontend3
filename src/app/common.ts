export const webServiceEndpoint: String = 'http://localhost:8080/';
// export const webServiceEndpoint: String = location.origin + '/auna.hmedicos.ws.1.0/';

export const REPORTE_PDF: String = 'PDF';
export const REPORTE_EXCEL: String = 'XLSX';

export const ESTADO_POREMETIR: any = 4;
export const ESTADO_PORPAGAR: any = 6;
export const ESTADO_PAGADO: any = 7;

export const TODAS_PLANILLAS: any = 0;
export const TODAS_OBSERVADAS: any = 1;

export const EVE_LOGIN: any = 1;
export const EVE_CABECERA: any = 2;
export const EVE_EMITIDAS: any = 3;
export const EVE_REG_FACTURAS: any = 4;
export const EVE_REG_RHE: any = 5;
export const EVE_PORPAGAR: any = 6;
export const EVE_PAGADO: any = 7;

export const FECHA_FORMAT: string = 'yyyy/MM/dd';
export const DIAS_DEFECTTO: number = 3;
export const DOCUMENTO_RHE: string = 'RH';
export const DOCUMENTO_FACTURA: string = 'FA';

export const ADJ_SOLO_COMPROBANTE: any = '1';
export const ADJ_COMPROBANTE_CERTIFICADO: any = '0';

export const INTERCAMBIA_SI_NO: any = '0';
export const SI_O_NO_FIJO: any = '1';

export const CLIC_SI_RHE: any = '1';
export const CLIC_NO_RHE: any = '2';

export const RUTA_PROTOCOLO: string = 'assets/doc/protocolos.docx';

export const PANTALLA_EMITIR: string = 'EMITIR';
export const PANTALLA_POR_PAGAR: string = 'PORPAGAR';
export const PANTALLA_PAGADAS: string = 'PAGADAS';
export const PANTALLA_PROCESO: string = 'PROCESOE';

export const MENSAJES = {
    ERROR_LOGIN: 'El usuario y/o contraseña es incorrecto. Por favor intentar nuevamente.',
    TITULO_VALIDACION: 'Mensaje de Validación',
    MSG_ADJ_COMPROBANTE: 'Adjunte Comprobante',
    MSG_ADJ_CERTIFICADO: 'Adjunte Certificado',
    MSG_VALIDA_PLANILLA: 'Debe haber al menos una liquidación en el registro del comprobante'
};

export const SECURITY = {
	KEY_PRIVATE :'AUNAHHMM987654321',
	VI_PRIVATE : 'AUNAHHMM987654321'
};

