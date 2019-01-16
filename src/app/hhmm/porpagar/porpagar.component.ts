import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicoResponse } from '../../dto/MedicoResponse';

// Service
import { SpringService } from '../../services/spring.service';
import { ReporteService } from '../../services/reporte.service';

import { Sede } from '../../dto/Sede';
import { PlanillaRequest } from '../../dto/PlanillaRequest';
import { PlanillaResponse } from '../../dto/PlanillaResponse';
import { PlanillaDetalleRequest } from '../../dto/PlanillaDetalleRequest';
import { PlanillaDetalleResponse } from '../../dto/PlanillaDetalleResponse';
import { ReportePlanillaRequest } from '../../dto/ReportePlanillaRequest';
import { ESTADO_PORPAGAR, TODAS_PLANILLAS, EVE_PORPAGAR, PANTALLA_POR_PAGAR, REPORTE_EXCEL, REPORTE_PDF} from '../../common';

@Component({
  selector: 'app-porpagar',
  templateUrl: './porpagar.component.html',
  styleUrls: ['./porpagar.component.css'],
  providers: [SpringService, ReporteService]
})

export class PorpagarComponent implements OnInit {
  public medicoUser: MedicoResponse = new MedicoResponse();
  public planillaRequest: PlanillaRequest;
  public planillaResponse: PlanillaResponse[];
  public planillaDetalle: PlanillaDetalleResponse[];
  public p: Number = 1;
  public itemsPorPag: Number = 7;
  public pantalla: any;
  public reportePlanilla: ReportePlanillaRequest;
  public disableExportar: boolean = true;

  constructor(
    private _springService: SpringService,
    private _reporteService: ReporteService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));
    this.medicoUser.porEmitir = localStorage.getItem('montoPorEmitir');
    this.medicoUser.porPagar = localStorage.getItem('montoPorPagar');
    this.medicoUser.pagada = localStorage.getItem('montoPagado');

    if (!this.medicoUser) {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else {
      this.pantalla = PANTALLA_POR_PAGAR;
      localStorage.setItem('pantalla', JSON.stringify(this.pantalla));
      let cmbHeader: Sede;
      cmbHeader = JSON.parse(localStorage.getItem('sede'));
      this.planillaRequest = new PlanillaRequest();
      this.planillaRequest.idCompania = cmbHeader.codigointsed_vch.toString();
      this.planillaRequest.idEmpresa = this.medicoUser.codper;
      this.planillaRequest.estadoDocumento = ESTADO_PORPAGAR;
      this.planillaRequest.flagObservadas = TODAS_PLANILLAS;
      this.planillaRequest.fechaInicio = '2018/01/01"';
      this.planillaRequest.fechaFin = '2018/12/30';
      this.planillaRequest.codGenerado = this.medicoUser.idlog_num;
      this.planillaRequest.codEvento = EVE_PORPAGAR;

      this._springService.getPlanilla(this.planillaRequest)
        .subscribe(
          (data: PlanillaResponse[]) => {
            this.planillaResponse = data;
            if (this.planillaResponse !== undefined) {
              if ( this.planillaResponse.length > 0) {
                this.disableExportar = false;
              }
            }
          },
          error => {
            console.error(error);
          }
        );

      // console.log('Entró al constructor!!!!' + this.pantalla + '|' + this.planillaResponse.length);
    }

    /*if (!this.planillaResponse === undefined) {
      if ( this.planillaResponse.length > 0) {
        this.disableExportar = false;
      } else {
        this.disableExportar = true;
      }
    } else {
      this.disableExportar = true;
    }*/
    console.log('ingreso otra vez a la pantalla por pagar');
  }

  cambiarTab(tab: string) {
    if ('emitir' === tab) {
      // this.estado[0] = 'active';
      // this.estado[1] = '';
      // this.estado[2] = '';
      this._router.navigate(['./dashb']);
    }
    if ('porpagar' === tab) {
      // this.estado[0] = '';
      // this.estado[1] = 'active';
      // this.estado[2] = '';
      this._router.navigate(['./prpg']);
    }
    if ('pagado' === tab) {
      // this.estado[0] = '';
      // this.estado[1] = '';
      // this.estado[2] = 'active';
      this._router.navigate(['./pagd']);
    }

  }

  verDetalle(planilla: PlanillaResponse) {
    const planillaSeleccionada = new PlanillaDetalleRequest();
    planillaSeleccionada.idCompania = planilla.idCompania;
    planillaSeleccionada.idEmpresa = this.medicoUser.codper;
    planillaSeleccionada.idPlanilla = planilla.idPlanilla;
    planillaSeleccionada.codGenerado = this.medicoUser.idlog_num;
    planillaSeleccionada.codEvento = EVE_PORPAGAR;

    this._springService.getPlanillaDetalle(planillaSeleccionada)
      .subscribe(
        (data: PlanillaDetalleResponse[]) => {
          this.planillaDetalle = [];
          this.planillaDetalle = data;
          localStorage.setItem('planillaDetalle', JSON.stringify(this.planillaDetalle));
          localStorage.setItem('tabAnterior', JSON.stringify(6));
          this._router.navigate(['./deta']);
        },
        error => {
          console.error(error);
        }
      );
  }

  imprimirExcel(reporte: any) {
    this.reportePlanilla = new ReportePlanillaRequest();
    this.reportePlanilla.tipo = REPORTE_EXCEL.toString();
    this.reportePlanilla.reporte = reporte;
    this.reportePlanilla.usuario = this.medicoUser.login;
    this.reportePlanilla.planillas = this.planillaResponse;

    this._reporteService.getPReportePlanillaXlsx(this.reportePlanilla)
      .subscribe(
        (res) => {
          const elem = window.document.createElement('a');
          elem.id = 'planillasId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'planillas.xlsx';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');
        }, error => {
          console.log(error);
        }
      );
  }

  imprimirPdf(reporte: any) {
    this.reportePlanilla = new ReportePlanillaRequest();
    this.reportePlanilla.tipo = REPORTE_PDF.toString();
    this.reportePlanilla.reporte = reporte;
    this.reportePlanilla.usuario = this.medicoUser.login;
    this.reportePlanilla.planillas = this.planillaResponse;

    this._reporteService.getPReportePlanillaPdf(this.reportePlanilla)
      .subscribe(
        (res) => {
          const elem = window.document.createElement('a');
          elem.id = 'planillasId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'planillas.pdf';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');
        }, error => {
          console.log(error);
        }
      );
  }

}
