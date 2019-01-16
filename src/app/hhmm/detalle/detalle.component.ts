import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// Service
import { SpringService } from '../../services/spring.service';
import { ReporteService } from '../../services/reporte.service';
import { ReportePlanillaDetalleRequest } from '../../dto/ReportePlanillaDetalleRequest';

// Request-Response
import { PlanillaDetalleResponse } from '../../dto/PlanillaDetalleResponse';
import { MedicoResponse } from '../../dto/MedicoResponse';

import { REPORTE_PDF, REPORTE_EXCEL } from '../../common';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  providers: [SpringService, ReporteService]
})
export class DetalleComponent implements OnInit {
  public medicoUser: MedicoResponse = new MedicoResponse();
  public planillaDetalle: PlanillaDetalleResponse[];
  public reportePlanillaDetalle: ReportePlanillaDetalleRequest;

  public nombreBanco: string;
  public nroCuenta: string;
  public itemsPorPag: Number = 7;
  public p: Number = 1;
  public tabAnteior: any;
  constructor(
    private _reporteService: ReporteService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));
    this.tabAnteior = JSON.parse(localStorage.getItem('tabAnterior'));

    if (!this.medicoUser) {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else {
      this.planillaDetalle = JSON.parse(localStorage.getItem('planillaDetalle'));
      this.nombreBanco = (this.planillaDetalle[0].banco === null) ? '' : this.planillaDetalle[0].banco ;
      this.nroCuenta = (this.planillaDetalle[0].cuentaBancaria === null) ? '' : this.planillaDetalle[0].cuentaBancaria ;
    }
  }

  anteriorPagina() {
    if (this.tabAnteior === 4) {
      this._router.navigate(['./dashb']);
    }
    if (this.tabAnteior === 6) {
      this._router.navigate(['./prpg']);
    }
    if (this.tabAnteior === 7) {
      this._router.navigate(['./pagd']);
    }
  }

  imprimirDetallePdf() {
    this.reportePlanillaDetalle = new ReportePlanillaDetalleRequest();
    this.reportePlanillaDetalle.tipo = REPORTE_PDF.toString();
    this.reportePlanillaDetalle.reporte = this.tabAnteior;
    this.reportePlanillaDetalle.usuario = this.medicoUser.login;
    this.reportePlanillaDetalle.planillas = this.planillaDetalle;

    this._reporteService.getPReportePlanillaDetallePdf(this.reportePlanillaDetalle)
      .subscribe(
        (res) => {
          const elem = window.document.createElement('a');
          elem.id = 'detalleId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'detalle.pdf';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');
        }, error => {
          console.log(error);
        }
      );
  }

  imprimirDetalleExcel() {
    this.reportePlanillaDetalle = new ReportePlanillaDetalleRequest();
    this.reportePlanillaDetalle.tipo = REPORTE_EXCEL.toString();
    this.reportePlanillaDetalle.reporte = this.tabAnteior;
    this.reportePlanillaDetalle.usuario = this.medicoUser.login;
    this.reportePlanillaDetalle.planillas = this.planillaDetalle;

    this._reporteService.getPReportePlanillaDetalleXlsx(this.reportePlanillaDetalle)
      .subscribe(
        (res) => {
          const elem = window.document.createElement('a');
          elem.id = 'detalleId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'detalle.xlsx';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');
        }, error => {
          console.log(error);
        }
      );
  }

}
