export class ComprobanteRequest {
    public idCompania: string;
    public idEmpresa: any;
    public idPlanilla: string;
    public comprobanteSerie: string;
    public comprobanteNumero: string;
    public fechaEmision: string;
    public tipoDocumento: string;
    public flagRetencion: string;
    public mComprobante: FormData = new FormData();
    public mRetencion: FormData = new FormData();
    public nroCertificado: string;
    public idlog_num: any;
}
