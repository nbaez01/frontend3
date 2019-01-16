import { Pipe, HostListener, Component, OnInit} from '@angular/core';
// Request-Response
import { MedicoResponse } from '../dto/MedicoResponse';
import { Sede } from '../dto/Sede';
import { PlanillaResponse } from '../dto/PlanillaResponse';
import { Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service';
import { DashboardMontosResponse } from '../dto/DashboardMontosResponse';
import { PlanillaRequest } from '../dto/PlanillaRequest';
import { SpringService } from '../services/spring.service';
import { RUTA_PROTOCOLO, EVE_CABECERA, ESTADO_POREMETIR, PANTALLA_PAGADAS, PANTALLA_POR_PAGAR } from '../common';
import { PANTALLA_EMITIR, TODAS_PLANILLAS, EVE_EMITIDAS } from '../common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [AutenticacionService, SpringService]
})
export class HeaderComponent implements OnInit {
  public medicoUser: MedicoResponse = new MedicoResponse();
  private activeAdvice: any;
  private activeMenuDesplegado: any;
  private activeMblAdviceBell: any;
  public listSede: Sede[];
  public cmbHeader: Sede;
  public listnotificacion: PlanillaResponse[];
  public dashboardMontosResponse: DashboardMontosResponse;
  public dashboard: PlanillaRequest;
  private wasInside = false;
  private planillaRequest: PlanillaRequest;

  constructor
    (
      private _router: Router,
      private _AutenticacionService: AutenticacionService,
      private _springService: SpringService
    ) {
  }

  ngOnInit() {
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));

    if (!this.medicoUser) {
      this.logoutSesion();
    } else {
      this.listSede = this.medicoUser.sede;
    }

    this.activeAdvice = 0;
    this.activeMenuDesplegado = 0;
    this.activeMblAdviceBell = 0;

    if ('sede' in localStorage) {
      this.cmbHeader = JSON.parse(localStorage.getItem('sede'));
    } else {
      this.cmbHeader = this.medicoUser.sede[3];
    }

    /*let cantListNotificacion = this.medicoUser.planillaResponse.length;
    this.listnotificacion = [];

    for (let i = 0; i < cantListNotificacion; i++) {
      if (this.medicoUser.planillaResponse[i].observadaFlag === 1) {
        let plantilla: PlanillaResponse;
        plantilla = this.medicoUser.planillaResponse[i];
        this.listnotificacion.push(plantilla);
      }
    }*/
    this.listnotificacion = [];

    this.planillaRequest = new PlanillaRequest();
    this.planillaRequest.idCompania = this.cmbHeader.codigointsed_vch.toString();
    this.planillaRequest.idEmpresa = this.medicoUser.codper;
    this.planillaRequest.estadoDocumento = ESTADO_POREMETIR;
    this.planillaRequest.flagObservadas = TODAS_PLANILLAS;
    this.planillaRequest.fechaInicio = '2018/01/01"';
    this.planillaRequest.fechaFin = '2018/12/30';
    this.planillaRequest.codGenerado = this.medicoUser.idlog_num;
    this.planillaRequest.codEvento = EVE_EMITIDAS;
    this.planilla(this.planillaRequest);
  }


  eventoBell() {
    const advice = document.getElementById('adviceBell');
    if (this.activeAdvice === 0 && this.listnotificacion.length > 0) {
      advice.classList.add('active');
      this.activeAdvice = 1;
    } else {
      advice.classList.remove('active');
      this.activeAdvice = 0;
    }
  }

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
    const advice = document.getElementById('adviceBell');
    const mblevntBell = document.getElementById('mblAdviceBell');

    advice.classList.remove('active');
    this.activeAdvice = 0;

    mblevntBell.classList.remove('active');
    this.activeMblAdviceBell = 0;
    }
    this.wasInside = false;
  }

  evntMenuDesplegado() {
    let menuDesplegado = document.getElementById('mblMenuDesplegado');

    if (this.activeMenuDesplegado === 0 ) {
      menuDesplegado.classList.add('active');
      this.activeMenuDesplegado = 1;
    } else {
      menuDesplegado.classList.remove('active');
      this.activeMenuDesplegado = 0;
    }

  }

  planilla(planilla: PlanillaRequest) {
    this._springService.getPlanilla(planilla)
      .subscribe(
        (data: PlanillaResponse[]) => {

          let cantListNotificacion = data.length;
          this.listnotificacion = [];

          for (let i = 0; i < cantListNotificacion; i++) {
            if (data[i].observadaFlag === 1) {
              let plantilla: PlanillaResponse;
              plantilla = data[i];
              this.listnotificacion.push(plantilla);
            }
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  mblevntBell() {
    console.log('buscando evento ---');
    let mblevntBell = document.getElementById('mblAdviceBell');

    if (this.activeMblAdviceBell === 0) {
      mblevntBell.classList.add('active');
      this.activeMblAdviceBell = 1;
    } else {
      mblevntBell.classList.remove('active');
      this.activeMblAdviceBell = 0;
    }
  }

  cmbHeaderEvnt(SedeCmb) {
    this.cmbHeader = SedeCmb;
    localStorage.setItem('sede', JSON.stringify(this.cmbHeader));
    const pantalla = JSON.parse(localStorage.getItem('pantalla'));

    this.cargarDashboard(this.cmbHeader.codigointsed_vch);

    if (pantalla === PANTALLA_PAGADAS) {
      this._router.navigate(['./pagd']);
      console.log('rutear a pagado');
      // window.location.reload();
    } else if (pantalla === PANTALLA_POR_PAGAR) {
      this._router.navigate(['./prpg']);
      console.log('rutear a por pagar');
      // window.location.reload();
    } else if (pantalla === PANTALLA_EMITIR) {
      this._router.navigate(['./dashb']);
      // window.location.reload();
    }
  }

  cargarDashboard(codInterno: string) {

    this.dashboard = new PlanillaRequest();
    this.dashboard.idCompania = codInterno;
    this.dashboard.idEmpresa = this.medicoUser.codper;
    this.dashboard.codGenerado = this.medicoUser.idlog_num;
    this.dashboard.codEvento = EVE_CABECERA;
    this._springService.getDashboard(this.dashboard)
      .subscribe(
        (data: DashboardMontosResponse) => {
          this.dashboardMontosResponse = data;
          localStorage.removeItem('montoPorEmitir');
          localStorage.removeItem('montoPorPagar');
          localStorage.removeItem('montoPagado');
          localStorage.setItem('montoPorEmitir', this.dashboardMontosResponse.montoPorEmitir);
          localStorage.setItem('montoPorPagar', this.dashboardMontosResponse.montoPorPagar);
          localStorage.setItem('montoPagado', this.dashboardMontosResponse.montoPagado);
          window.location.reload();
        },
        error => {
          console.error(error);
        }
      );
  }

  cbHeader() {
    let bellDstp = document.getElementById('adviceBell');
    bellDstp.classList.remove('active');
    this.activeAdvice = 0;
  }

  volverDashEmitir() {
    this._router.navigate(['./dashb']);
  }

  logoutSesion() {
    this._AutenticacionService.getCerrarSesion();
  }

  descargarProtocolo() {
    let url = RUTA_PROTOCOLO;
    window.open(url, '_self');
  }
}
