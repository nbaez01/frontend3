import { Component, OnInit, TemplateRef } from '@angular/core';
import { MedicoResponse } from '../../dto/MedicoResponse';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// Service
import { SpringService } from '../../services/spring.service';
import { ReporteService } from '../../services/reporte.service';

import { Sede } from '../../dto/Sede';
import { PlanillaRequest } from '../../dto/PlanillaRequest';
import { PlanillaResponse } from '../../dto/PlanillaResponse';
import { PlanillaDetalleRequest } from '../../dto/PlanillaDetalleRequest';
import { PlanillaDetalleResponse } from '../../dto/PlanillaDetalleResponse';
import { ReportePlanillaRequest } from '../../dto/ReportePlanillaRequest';
import { DashboardMontosResponse } from '../../dto/DashboardMontosResponse';
import { ReportePersonalizadoRequest } from '../../dto/ReportePersonalizadoRequest';

import { ESTADO_PAGADO, TODAS_PLANILLAS, EVE_PAGADO, FECHA_FORMAT, PANTALLA_PAGADAS, REPORTE_EXCEL, REPORTE_PDF } from '../../common';

@Component({
  selector: 'app-pagados',
  templateUrl: './pagados.component.html',
  styleUrls: ['./pagados.component.css'],
  providers: [DatePipe, SpringService, ReporteService]
})
export class PagadosComponent implements OnInit {
  public medicoUser: MedicoResponse = new MedicoResponse();
  public planillaRequest: PlanillaRequest;
  public planillaResponse: PlanillaResponse[];
  public planillaDetalle: PlanillaDetalleResponse[];
  public opcionSeleccionado: number = 7;
  public fcFechaInicio: String;
  public fcFechaFin: String;
  public estadoCombo: String = '';
  public itemsPorPag: Number = 7;
  public p: Number = 1;
  public pantalla: any;
  public reportePlanilla: ReportePlanillaRequest;
  public disableExportar: boolean = true;
  public dashboardMontosResponse: DashboardMontosResponse;
  public reportePersonalizadoRequest: ReportePersonalizadoRequest;

  public modalRef: BsModalRef;

  constructor(
    private _springService: SpringService,
    private _reporteService: ReporteService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));
    this.medicoUser.porEmitir = localStorage.getItem('montoPorEmitir');
    this.medicoUser.porPagar = localStorage.getItem('montoPorPagar');
    this.medicoUser.pagada = localStorage.getItem('montoPagado');

    if (!this.medicoUser) {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else {
      this.pantalla = PANTALLA_PAGADAS;
      localStorage.setItem('pantalla', JSON.stringify(this.pantalla));
      let cmbHeader: Sede;
      cmbHeader = JSON.parse(localStorage.getItem('sede'));
      this.planillaRequest = new PlanillaRequest();
      this.planillaRequest.idCompania = cmbHeader.codigointsed_vch.toString();
      this.planillaRequest.idEmpresa = this.medicoUser.codper;
      this.planillaRequest.estadoDocumento = ESTADO_PAGADO;
      this.planillaRequest.flagObservadas = TODAS_PLANILLAS;
      this.planillaRequest.fechaInicio = '2018/01/01"';
      this.planillaRequest.fechaFin = '2018/12/30';
      this.planillaRequest.codGenerado = this.medicoUser.idlog_num;
      this.planillaRequest.codEvento = EVE_PAGADO;
      this.cargarPagados(this.planillaRequest);

     /* if (!this.planillaResponse === undefined) {
        if (this.planillaResponse.length > 0) {
          this.disableExportar = false;
        } else {
          this.disableExportar = true;
        }
      } else {
        this.disableExportar = true;
      }*/
    }
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
    planillaSeleccionada.codEvento = EVE_PAGADO;

    this._springService.getPlanillaDetalle(planillaSeleccionada)
      .subscribe(
        (data: PlanillaDetalleResponse[]) => {
          this.planillaDetalle = [];
          this.planillaDetalle = data;
          localStorage.setItem('planillaDetalle', JSON.stringify(this.planillaDetalle));
          localStorage.setItem('tabAnterior', JSON.stringify(7));
          this._router.navigate(['./deta']);
        },
        error => {
          console.error(error);
        }
      );
  }
  cambiarEstado(filtro: number) {
    if (filtro > 0) {
      this.estadoCombo = '';
    } else {
      this.estadoCombo = 'active';
    }
  }

  aplicarFiltro(filtro: number, tmpEnvioExitoso: TemplateRef<any>, tmpEnvioErroneo: TemplateRef<any>) {
    let fechaInicio;
    let fechaFin;

    let cmbHeader: Sede;
    cmbHeader = JSON.parse(localStorage.getItem('sede'));

    if (filtro > 0) {
      const días = 1000 * 60 * 60 * 24 * filtro;
      fechaFin = this.datePipe.transform(new Date(), FECHA_FORMAT);
      const resta = new Date().getTime() - días;
      fechaInicio = this.datePipe.transform(resta, FECHA_FORMAT);
      console.log(fechaInicio + '|' + fechaFin);
      this.planillaRequest = new PlanillaRequest();
      this.planillaRequest.idCompania = cmbHeader.codigointsed_vch.toString();
      this.planillaRequest.idEmpresa = this.medicoUser.codper;
      this.planillaRequest.estadoDocumento = ESTADO_PAGADO;
      this.planillaRequest.flagObservadas = TODAS_PLANILLAS;
      this.planillaRequest.fechaInicio = fechaInicio;
      this.planillaRequest.fechaFin = fechaFin;
      this.planillaRequest.codGenerado = this.medicoUser.idlog_num;
      this.planillaRequest.codEvento = EVE_PAGADO;
      this.cargarPagados(this.planillaRequest);

      this.cargarDashboard(this.planillaRequest);
      // window.location.reload();

    } else {
      console.log(this.fcFechaInicio);
      console.log(this.fcFechaFin);
      this.reportePersonalizadoRequest = new ReportePersonalizadoRequest();
      this.reportePersonalizadoRequest.idEmpresa = this.medicoUser.codper;
      this.reportePersonalizadoRequest.idCompania = cmbHeader.codigointsed_vch;
      this.reportePersonalizadoRequest.idlog_num = this.medicoUser.idlog_num;
      this.reportePersonalizadoRequest.fechaInicio = this.fcFechaInicio.toString();
      this.reportePersonalizadoRequest.fechaFin = this.fcFechaFin.toString();

      this._reporteService.sendReportePersonalizado(this.reportePersonalizadoRequest)
      .subscribe(
        (data: String) => {
          const resultado: string = data.toString();
          if (resultado === '1') {
            console.log('exito');
            this.modalRef = this.modalService.show(tmpEnvioExitoso);
          } else {
            console.log('error');
            this.modalRef = this.modalService.show(tmpEnvioErroneo);
          }
        },
        error => {
          console.error(error);
        }
      );
    }



  }

  cargarPagados(planilla: PlanillaRequest) {
    this._springService.getPlanilla(this.planillaRequest)
      .subscribe(
        (data: PlanillaResponse[]) => {
          this.planillaResponse = data;
          if (this.planillaResponse !== undefined) {
            if (this.planillaResponse.length > 0) {
              this.disableExportar = false;
            }
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  cargarDashboard(planilla: PlanillaRequest) {
    this._springService.getDashboard(this.planillaRequest)
      .subscribe(
        (data: DashboardMontosResponse) => {
          this.dashboardMontosResponse = data;
          localStorage.setItem('montoPagado', this.dashboardMontosResponse.montoPagado);
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
