import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// Request-Response
import { PlanillaRequest } from '../../dto/PlanillaRequest';
import { MedicoResponse } from '../../dto/MedicoResponse';
import { PlanillaResponse } from '../../dto/PlanillaResponse';
import { PlanillaDetalleRequest } from '../../dto/PlanillaDetalleRequest';
import { PlanillaDetalleResponse } from '../../dto/PlanillaDetalleResponse';
import { ReportePlanillaRequest } from '../../dto/ReportePlanillaRequest';
import { DashboardMontosResponse } from '../../dto/DashboardMontosResponse';
// Service
import { SpringService } from '../../services/spring.service';
import { ReporteService } from '../../services/reporte.service';

import { REPORTE_PDF, REPORTE_EXCEL, EVE_EMITIDAS, PANTALLA_EMITIR, ESTADO_POREMETIR, TODAS_PLANILLAS, FECHA_FORMAT } from '../../common';
import { Sede } from '../../dto/Sede';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SpringService, ReporteService]
})
export class DashboardComponent implements OnInit {
  public medicoUser: MedicoResponse = new MedicoResponse();
  public planillaRequest: PlanillaRequest;
  public listaPlanillas: PlanillaResponse[];
  public cantidadSeleccionados: number;
  public planillaSeleccionada: PlanillaDetalleRequest;
  public planillaDetalle: PlanillaDetalleResponse[];
  public listPlanillasRegistro: PlanillaResponse[];
  public reportePlanilla: ReportePlanillaRequest;
  public disableRegistrarComprobante: boolean;
  public estado: string[] = ['active', '', ''];
  public itemsPorPag: Number = 7;
  public p: Number = 1;
  public isSelectedAll: boolean;
  public flagCheckedAll: boolean = false;
  public pantalla: any;
  public disableExportar: boolean = true;
  public dashboardMontosResponse: DashboardMontosResponse;

  constructor(
    private _springService: SpringService,
    private _reporteService: ReporteService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.listPlanillasRegistro = [];
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));
    this.medicoUser.porEmitir = localStorage.getItem('montoPorEmitir');
    this.medicoUser.porPagar = localStorage.getItem('montoPorPagar');
    this.medicoUser.pagada = localStorage.getItem('montoPagado');

    if (!this.medicoUser) {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else {
      // this.listaPlanillas = this.medicoUser.planillaResponse;
      this.pantalla = PANTALLA_EMITIR;
      localStorage.setItem('pantalla', JSON.stringify(this.pantalla));

      this.listaPlanillas = this.medicoUser.planillaResponse;
      this.cantidadSeleccionados = 0;
      this.disableRegistrarComprobante = true;
      this.isSelectedAll = false;

      let cmbHeader: Sede;
      cmbHeader = JSON.parse(localStorage.getItem('sede'));

      this.planillaRequest = new PlanillaRequest();
      this.planillaRequest.idCompania = cmbHeader.codigointsed_vch.toString();
      this.planillaRequest.idEmpresa = this.medicoUser.codper;
      this.planillaRequest.estadoDocumento = ESTADO_POREMETIR;
      this.planillaRequest.flagObservadas = TODAS_PLANILLAS;
      this.planillaRequest.fechaInicio = '2018/01/01"';
      this.planillaRequest.fechaFin = '2018/12/30';
      this.planillaRequest.codGenerado = this.medicoUser.idlog_num;
      this.planillaRequest.codEvento = EVE_EMITIDAS;
      this.cargarDashboard(this.planillaRequest);
      this.medicoUser.porEmitir = localStorage.getItem('montoPorEmitir');
      this.medicoUser.porPagar = localStorage.getItem('montoPorPagar');
      this.cargarPorEmitir(this.planillaRequest);
      // window.location.reload();
      /*if (!this.listaPlanillas === undefined) {
        if ( this.listaPlanillas.length > 0) {
          this.disableExportar = false;
        } else {
          this.disableExportar = true;
        }
      } else {
        this.disableExportar = true;
      }*/
    }
  }

  verDetalle(planilla: PlanillaResponse) {
    this.planillaSeleccionada = new PlanillaDetalleRequest();
    this.planillaSeleccionada.idCompania = planilla.idCompania;
    this.planillaSeleccionada.idEmpresa = this.medicoUser.codper;
    this.planillaSeleccionada.idPlanilla = planilla.idPlanilla;
    this.planillaSeleccionada.codGenerado = this.medicoUser.idlog_num;
    this.planillaSeleccionada.codEvento = EVE_EMITIDAS;
    // let cmbHeader: Sede;
    // cmbHeader = JSON.parse(localStorage.getItem('sede'));
    // this.planillaSeleccionada.idCompania = cmbHeader.idsed_num;
    // localStorage.setItem('planillaSeleccionada', JSON.stringify(this.planillaSeleccionada));
    this._springService
      .getPlanillaDetalle(this.planillaSeleccionada)
      .subscribe(
        (data: PlanillaDetalleResponse[]) => {
          this.planillaDetalle = [];
          this.planillaDetalle = data;
          localStorage.setItem('planillaDetalle', JSON.stringify(this.planillaDetalle));
          localStorage.setItem('tabAnterior', JSON.stringify(4));
          this._router.navigate(['./deta']);
        },
        error => {
          console.error(error);
          this.planillaSeleccionada = new PlanillaDetalleRequest();
        } /*,
        () => console.log('Login completado')*/
      );
  }

  registrarComprobante() {
    localStorage.setItem(
      'listaPlanillaRegistro',
      JSON.stringify(this.listPlanillasRegistro)
    );
    this._router.navigate(['./proc']);
  }

  checkBoxPlanilla(planillaAdd: PlanillaResponse) {
    let flagEncontrado = false;
    for (let i = 0; i < this.listPlanillasRegistro.length; i++) {

      if (this.listPlanillasRegistro[i].idPlanilla === planillaAdd.idPlanilla) {
        this.listPlanillasRegistro.splice(i, 1);
        flagEncontrado = true;
        break;
      }
    }
    if (!flagEncontrado) {
      planillaAdd.checked = true;
      this.listPlanillasRegistro.push(planillaAdd);
      this.cantidadSeleccionados++;
    } else {
      this.cantidadSeleccionados--;
    }

    if (this.listPlanillasRegistro.length > 0) {
      this.disableRegistrarComprobante = false;
    } else {
      this.disableRegistrarComprobante = true;
    }

    // if(this.listPlanillasRegistro.length == 0){
    //   this.flagCheckedAll = false;
    // } //validar checkedBox

  }

  imprimirPdf(reporte: any) {
    this.reportePlanilla = new ReportePlanillaRequest();
    this.reportePlanilla.tipo = REPORTE_PDF.toString();
    this.reportePlanilla.reporte = reporte;
    this.reportePlanilla.usuario = this.medicoUser.login;
    this.reportePlanilla.planillas = this.listaPlanillas;

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

  cargarDashboard(planilla: PlanillaRequest) {
    this._springService.getDashboard(this.planillaRequest)
      .subscribe(
        (data: DashboardMontosResponse) => {
          this.dashboardMontosResponse = data;
          localStorage.removeItem('montoPorEmitir');
          localStorage.removeItem('montoPorPagar');
          localStorage.setItem('montoPorEmitir', this.dashboardMontosResponse.montoPorEmitir);
          localStorage.setItem('montoPorPagar', this.dashboardMontosResponse.montoPorPagar);
          // window.location.reload();
        },
        error => {
          console.error(error);
        }
      );
  }

  cargarPorEmitir(planilla: PlanillaRequest) {
    // console.log('aqui!!');
    this._springService.getPlanilla(this.planillaRequest)
      .subscribe(
        (data: PlanillaResponse[]) => {
          this.listaPlanillas = data;
          this.medicoUser.planillaResponse = this.listaPlanillas;
          localStorage.removeItem('medicoUser');
          localStorage.setItem('medicoUser', JSON.stringify(this.medicoUser));
          if (this.listaPlanillas !== undefined) {
            if (this.listaPlanillas.length > 0) {
              this.disableExportar = false;
            }
          }
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
    this.reportePlanilla.planillas = this.listaPlanillas;

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

  cambiarTab(tab: string) {
    if ('emitir' === tab) {
      this.estado[0] = 'active';
      this.estado[1] = '';
      this.estado[2] = '';
    }
    if ('porpagar' === tab) {
      this.estado[0] = '';
      this.estado[1] = 'active';
      this.estado[2] = '';
      this._router.navigate(['./prpg']);
    }
    if ('pagado' === tab) {
      this.estado[0] = '';
      this.estado[1] = '';
      this.estado[2] = 'active';
      this._router.navigate(['./pagd']);
    }

  }
  selectAll() {
    this.isSelectedAll = !this.isSelectedAll;
    this.listPlanillasRegistro = [];

    if (this.isSelectedAll) {
      this.cantidadSeleccionados = this.listaPlanillas.length;
      for (let i = 0; i < this.listaPlanillas.length; i++) {
        const planillaCkd: PlanillaResponse = this.listaPlanillas[i];
        planillaCkd.checked = true;
        this.listaPlanillas[i] = planillaCkd;
        this.listPlanillasRegistro.push(this.listaPlanillas[i]);
      }
    } else {
      this.cantidadSeleccionados = 0;
      // this.listPlanillasRegistro = [];
      for (let i = 0; i < this.listaPlanillas.length; i++) {
        const planillaCkd: PlanillaResponse = this.listaPlanillas[i];
        planillaCkd.checked = false;
        this.listaPlanillas[i] = planillaCkd;
      }
    }

    if (this.listPlanillasRegistro.length > 0) {
      this.disableRegistrarComprobante = false;
    } else {
      this.disableRegistrarComprobante = true;
    }
  }
  cambioDePagina() {
    //  let radioB = document.getElementById("11111111");
    //  radioB.setAttribute('checked', 'checked');
    //  this.isSelectedAll = false;
    //  alert("valuee: " + this.isSelectedAll);
  }

}
