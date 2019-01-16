import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { webServiceEndpoint } from '../common';
import { Observable } from 'rxjs';
import { Persona } from '../dto/Persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: Http) { }

  getListaPersona(): Observable<Persona[]> {
    return this.http.get(webServiceEndpoint.concat("listaPersona"))
      .map((res => <Persona[]>res.json()));;
  }


  getPReportePlanillaPdf() {
    return this.http.post(webServiceEndpoint.concat('reportePlanillaPdf'), "PDF",
      { responseType: ResponseContentType.Blob })
      .map(
        (res) => {
          return new Blob([res.blob()], { type: 'application/pdf' });
        });
  }

  getPReportePlanillaXlsx() {
    return this.http.post(webServiceEndpoint.concat('reportePlanillaXlsx'), "XLSX",
      { responseType: ResponseContentType.Blob })
      .map(
        (res) => {
          return new Blob([res.blob()], { type: 'application/vnd.ms-excel' });
        });
  }

  getPReportePlanillaHtml() {
    return this.http.post(webServiceEndpoint.concat('reportePlanillaHtml'), "HTML",
      { responseType: ResponseContentType.Blob })
      .map(
        (res) => {
          return new Blob([res.blob()], { type: 'text/html' });
        });
  }

  
}
