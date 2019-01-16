import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { webServiceEndpoint } from '../common';
import * as CryptoJS from 'crypto-js';
import 'rxjs/add/operator/map';

// Request-Response
import { ReportePlanillaRequest } from '../dto/ReportePlanillaRequest';
import { ReportePlanillaDetalleRequest } from '../dto/ReportePlanillaDetalleRequest';
import { ReportePersonalizadoRequest } from '../dto/ReportePersonalizadoRequest';

@Injectable()
export class ReporteService {

    constructor(private http: Http) { }

    getPReportePlanillaPdf(reportePlanilla: ReportePlanillaRequest) {
        return this.http.post(webServiceEndpoint.concat('api/reportePlanillaPdf'), reportePlanilla,
            { responseType: ResponseContentType.Blob })
            .map(
                (res) => {
                    return new Blob([res.blob()], { type: 'application/pdf' });
                });
    }

    getPReportePlanillaXlsx(reportePlanilla: ReportePlanillaRequest) {
        return this.http.post(webServiceEndpoint.concat('api/reportePlanillaXlsx'), reportePlanilla,
            { responseType: ResponseContentType.Blob })
            .map(
                (res) => {
                    return new Blob([res.blob()], { type: 'application/vnd.ms-excel' });
                });
    }

    getPReportePlanillaDetallePdf(reportePlanillaDetalle: ReportePlanillaDetalleRequest) {
        return this.http.post(webServiceEndpoint.concat('api/reportePlanillaDetallePdf'), reportePlanillaDetalle,
            { responseType: ResponseContentType.Blob })
            .map(
                (res) => {
                    return new Blob([res.blob()], { type: 'application/pdf' });
                });
    }

    getPReportePlanillaDetalleXlsx(reportePlanillaDetalle: ReportePlanillaDetalleRequest) {
        return this.http.post(webServiceEndpoint.concat('api/reportePlanillaDetalleXlsx'), reportePlanillaDetalle,
            { responseType: ResponseContentType.Blob })
            .map(
                (res) => {
                    return new Blob([res.blob()], { type: 'application/vnd.ms-excel' });
                });
    }

    sendReportePersonalizado(reportePersonalizado: ReportePersonalizadoRequest) {
        return this.http.post(webServiceEndpoint.concat('api/getReportePersonalizado'), reportePersonalizado)
        .map((res => <String>res.json()));
    }
}
