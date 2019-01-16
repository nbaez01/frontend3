import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { webServiceEndpoint, SECURITY } from '../common';
import * as CryptoJS from 'crypto-js';
import 'rxjs/add/operator/map';

// Request-Response
import { PlanillaDetalleRequest } from '../dto/PlanillaDetalleRequest';
import { PlanillaDetalleResponse } from '../dto/PlanillaDetalleResponse';
import { DashboardMontosResponse } from '../dto/DashboardMontosResponse';
import { ComprobanteRequest } from '../dto/ComprobanteRequest';

import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { PlanillaRequest } from '../dto/PlanillaRequest';
import { PlanillaResponse } from '../dto/PlanillaResponse';


@Injectable()
export class SpringService {

    constructor(private http: Http) { }

    getDashboard(planilla: PlanillaRequest) {
        return this.http.post(webServiceEndpoint.concat('api/getDashboard'), planilla)
        .map((res => <DashboardMontosResponse>res.json()));
    }

    getPlanilla(planilla: PlanillaRequest) {
        return this.http.post(webServiceEndpoint.concat('api/getPlanilla'), planilla)
        .map((res => <PlanillaResponse[]>res.json()));
    }

    getPlanillaDetalle(planillaDetalle: PlanillaDetalleRequest) {
        return this.http.post(webServiceEndpoint.concat('api/planillaDetalle'), planillaDetalle)
        .map((res => <PlanillaDetalleResponse[]>res.json()));
    }

    registrarProcesoEmision(fileComprobante: File, fileRetencion: any, envioFileRetencion: string , comprobante: ComprobanteRequest) {
        console.log('comprobante in pushFile: ' + JSON.stringify(comprobante));

        //DOBLE VALIDACION
        var key = CryptoJS.enc.Utf8.parse(SECURITY.KEY_PRIVATE);
        var iv  = CryptoJS.enc.Utf8.parse(SECURITY.KEY_PRIVATE);

        var cadena = envioFileRetencion+'|'+comprobante.idCompania+'|'+comprobante.idEmpresa+'|'+comprobante.idPlanilla+'|'+comprobante.comprobanteSerie+'|'+comprobante.comprobanteNumero+'|'+comprobante.fechaEmision+'|'+comprobante.tipoDocumento+'|'+comprobante.flagRetencion+'|'+comprobante.idlog_num;
        var encrypted = (CryptoJS.AES.encrypt(cadena, key, {iv: iv})).toString();
        console.log("CADENA ENCRIPTADA");
        console.log(cadena);
        console.log(encrypted);

        const formdata: FormData = new FormData();
        formdata.append('mComprobante', fileComprobante);
        formdata.append('mRetencion', fileRetencion);
        formdata.append('envioFileRetencion', envioFileRetencion);
        formdata.append('idCompania', comprobante.idCompania);
        formdata.append('idEmpresa', comprobante.idEmpresa);
        formdata.append('idPlanilla' , comprobante.idPlanilla);
        formdata.append('comprobanteSerie', comprobante.comprobanteSerie);
        formdata.append('comprobanteNumero', comprobante.comprobanteNumero);
        formdata.append('fechaEmision', comprobante.fechaEmision);
        formdata.append('tipoDocumento', comprobante.tipoDocumento);
        formdata.append('flagRetencion', comprobante.flagRetencion);
        formdata.append('idlog_num', comprobante.idlog_num);
        formdata.append('crypto', encrypted);

        return this.http.post(webServiceEndpoint.concat('/api/comprobante'), formdata);
    }

    pushFileExample(file: File, comprobante: ComprobanteRequest) {
        console.log('comprobante in pushFile: ' + JSON.stringify(comprobante));
        // 10 parameters
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('idCompania', comprobante.idCompania);
        formdata.append('idEmpresa', comprobante.idEmpresa);
        formdata.append('comprobanteSerie', comprobante.comprobanteSerie);
        formdata.append('nencuentro', '123232');
        // formdata.append('comprobante',JSON.stringify(comprobante));
        // return this.http.post(webServiceEndpoint.concat('/api/handle'), formdata,JSON.stringify(comprobante));
        // return this.http.post(webServiceEndpoint.concat('/api/handle'), formdata, comprobante);
        return this.http.post(webServiceEndpoint.concat('/api/comprobante'), comprobante);
    }
}
