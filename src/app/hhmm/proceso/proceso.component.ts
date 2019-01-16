import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PlanillaResponse } from '../../dto/PlanillaResponse';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MedicoResponse } from '../../dto/MedicoResponse';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { _getComponentHostLElementNode } from '@angular/core/src/render3/instructions';
import { ComprobanteRequest } from '../../dto/ComprobanteRequest';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SpringService } from '../../services/spring.service';
import { PlanillaRequest } from '../../dto/PlanillaRequest';
import { DashboardMontosResponse } from '../../dto/DashboardMontosResponse';

// instalados
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CustomValidators } from 'ng2-validation';
import { Sede } from '../../dto/Sede';
import { ESTADO_POREMETIR, EVE_PAGADO, EVE_EMITIDAS, TODAS_PLANILLAS, MENSAJES, DOCUMENTO_FACTURA, DOCUMENTO_RHE, ADJ_SOLO_COMPROBANTE, ADJ_COMPROBANTE_CERTIFICADO, PANTALLA_PROCESO, INTERCAMBIA_SI_NO, CLIC_SI_RHE, CLIC_NO_RHE } from '../../common';
import { ToastrService } from 'ngx-toastr';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css'],
  providers: [SpringService, AutenticacionService]
})
export class ProcesoComponent implements OnInit {
  public listPlanillasRegistro: PlanillaResponse[];
  public planillaEliminar: PlanillaResponse;
  public montoSubTotal: any;
  public montodescuento: any;
  public montoTotal: any;
  public divRHE: boolean;
  public divNoRHE: boolean;
  public placeHldSerie: string;
  public placeHldNumero: string;
  public divImagePdfComprobante: boolean;
  public divImagePdfRetencion: boolean;
  public windowHeight: any;
  public validaDrag: boolean;
  public disableBtnRegComp: boolean;
  public medicoUser: MedicoResponse = new MedicoResponse();
  public modalRef: BsModalRef;
  public comprobanteProcesoE: ComprobanteRequest = new ComprobanteRequest();
  public fileComprobante: File;
  public fileRetencion: File;
  public nameFileRetencion: string;
  public nameFIleComprobante: string;
  public files: UploadFile[] = [];//dropped - comprobante
  public filesRetencion: UploadFile[] = [];//dropped - retencion
  public submitted: boolean = false;
  public terminosCondiciones: string = '';
  public certfObligatorio: boolean;
  public dashboardMontosResponse: DashboardMontosResponse;
  public dashboard: PlanillaRequest;
  public si_no_RHE: string;
  fb: FormBuilder;
  registerForm: FormGroup;
  public pantalla: any;
  constructor(
    private _router: Router,
    private modalService: BsModalService,
    private _springService: SpringService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private _AutenticacionService: AutenticacionService) {

  }

  ngOnInit() {
    this.medicoUser = JSON.parse(localStorage.getItem('medicoUser'));
    if (!this.medicoUser) {
      localStorage.clear();
      this._router.navigate(['/login']);
    } else {
      this.pantalla = PANTALLA_PROCESO;
      localStorage.setItem('pantalla', JSON.stringify(this.pantalla));
      this.listPlanillasRegistro = JSON.parse(localStorage.getItem('listaPlanillaRegistro'));
      this.montoSubTotal = 0;
      this.montodescuento = 0;
      this.montoTotal = 0;
      this.getMontosIniciales();
      this.divRHE = true;
      this.divNoRHE = false;
      this.placeHldSerie = 'Serie de RHE:';
      this.placeHldNumero = 'Numero de RHE:';
      this.divImagePdfComprobante = false;
      this.divImagePdfRetencion = false;
      this.windowHeight = window.innerWidth; // ancho
      // console.log('width: ' + this.windowHeight);
      this.validaDrag = true;
      this.disableBtnRegComp = true;
      this.nameFileRetencion = '';
      this.nameFIleComprobante = '';
      this.terminosCondiciones = this.medicoUser.terminosCondiciones;
      this.certfObligatorio = false;
      this.si_no_RHE = CLIC_SI_RHE;
    }

    if (this.windowHeight < 770) {
      this.validaDrag = false;
    }

    // Ojo validar el valor del flag!! actualmente viene en 0
    let tabActivo = this.medicoUser.flagComprobante;
    // tabActivo = 'RH'; // Eliminar
    // 01: RHE 02: Factura
    if (tabActivo === DOCUMENTO_FACTURA) {
      this.tabFactura();
    } else {
      this.tabRhe();
    }
  }
  anteriorPagina() {
    this._router.navigate(['./dashb']);
  }
  quitarPlanilla(planilla: PlanillaResponse, template: TemplateRef<any>) {
    this.planillaEliminar = planilla;
    if (this.listPlanillasRegistro.length === 1) {
      this.modalRef = this.modalService.show(template);
    } else {
      this.quitarPlanillaConfirmado(this.planillaEliminar);
    }
  }
  quitarPlanillaConfirmado(planilla: PlanillaResponse) {
    for (let i = 0; i < this.listPlanillasRegistro.length; i++) {
      if (this.listPlanillasRegistro[i].idPlanilla === planilla.idPlanilla) {
        this.listPlanillasRegistro.splice(i, 1);
        this.montoSubTotal = this.montoSubTotal - planilla.valorVenta;
        this.montodescuento = this.montodescuento - planilla.montoImpuesto;
        this.montoTotal = this.montoTotal - planilla.monto;
        break;
      }
    }
  }
  eliminaPlanilla() {
    this.quitarPlanillaConfirmado(this.planillaEliminar);
    this.modalRef.hide();
    this._router.navigate(['./dashb']);
  }

  getMontosIniciales() {
    for (let i = 0; i < this.listPlanillasRegistro.length; i++) {
      this.montoSubTotal = this.montoSubTotal + this.listPlanillasRegistro[i].valorVenta;
      this.montodescuento = this.montodescuento + this.listPlanillasRegistro[i].montoImpuesto;
      this.montoTotal = this.montoTotal + this.listPlanillasRegistro[i].monto;
    }
  }
  tabFactura() {
    this.divRHE = false;
    const elmntFactura = document.getElementById('idTabFactura');
    elmntFactura.classList.add('active');
    const elmntRHE = document.getElementById('idTabRHE');
    elmntRHE.classList.remove('active');
    elmntRHE.classList.add('disabled');
    this.placeHldSerie = 'Serie de factura:';
    this.placeHldNumero = 'Numero de fac.:';
    this.divNoRHE = false;
    const elmntAdjComprobante = document.getElementById('idSeccAdjComprobante');
    elmntAdjComprobante.classList.remove('col-md-6');
    this.divImagePdfRetencion = false;
    document.getElementById('idParrafoIgv').innerHTML = 'IGV';
    // this.divImagePdfComprobante = false;
    // document.getElementById('idNombreComprobante').innerHTML = ''; // validar eliminando objeto cargado
  }
  tabRhe() {
    this.divRHE = true;
    const elmntRHE = document.getElementById('idTabRHE');
    elmntRHE.classList.add('active');
    const elmntFactura = document.getElementById('idTabFactura');
    elmntFactura.classList.remove('active');
    elmntFactura.classList.add('disabled');
    this.placeHldSerie = 'Serie de RHE:';
    this.placeHldNumero = 'Numero de RHE:';
    document.getElementById('idParrafoIgv').innerHTML = '4ta. categoría';
    let flagRetencion = this.medicoUser.flagRetencion;

    // this.medicoUser.flagRetencion = '0'; // Eliminame

    // flagRetencion
    // 0 - permite cambiar de si a no (Comprobante + certificado)
    // 1 - no permite cambiar se queda en si (solo comprobante)
    this.getSIvalues();

  }
  // sinRetencion() {
  //   this.divNoRHE = true;
  //   const elmntSinRetencion = document.getElementById('idSinRetencion');
  //   elmntSinRetencion.classList.add('active');
  //   const elmntConRetencion = document.getElementById('idConRetencion');
  //   elmntConRetencion.classList.remove('active');
  //   elmntConRetencion.classList.add('disabled');
  //   const elmntAdjComprobante = document.getElementById('idSeccAdjComprobante');
  //   elmntAdjComprobante.classList.add('col-md-6');
  // }
  // conRetencion() {
  //   this.divNoRHE = false;
  //   const elmntConRetencion = document.getElementById('idConRetencion');
  //   elmntConRetencion.classList.add('active');
  //   const elmntSinRetencion = document.getElementById('idSinRetencion');
  //   elmntSinRetencion.classList.remove('active');
  //   elmntSinRetencion.classList.add('disabled');
  //   const elmntAdjComprobante = document.getElementById('idSeccAdjComprobante');
  //   elmntAdjComprobante.classList.remove('col-md-6');
  // }

  getSIvalues() {
    this.si_no_RHE = CLIC_SI_RHE;
    let flagRetencion = this.medicoUser.flagRetencion;
    if (flagRetencion == INTERCAMBIA_SI_NO) {
      this.divNoRHE = false;
      const elmntConRetencion = document.getElementById('idConRetencion');
      elmntConRetencion.classList.add('active');
      const elmntSinRetencion = document.getElementById('idSinRetencion');
      elmntSinRetencion.classList.remove('active');
    } else {
      const elmntSinRetencion = document.getElementById('idSinRetencion');
      elmntSinRetencion.classList.remove('active');
      elmntSinRetencion.classList.add('disabled');
    }
    const elmntAdjComprobante = document.getElementById('idSeccAdjComprobante');
    elmntAdjComprobante.classList.remove('col-md-6');
  }
  getNOvalues() {
    this.si_no_RHE = CLIC_NO_RHE;
    let flagRetencion = this.medicoUser.flagRetencion;
    if (flagRetencion === INTERCAMBIA_SI_NO) {
      this.divNoRHE = true;
      const elmntSinRetencion = document.getElementById('idSinRetencion');
      elmntSinRetencion.classList.add('active');
      const elmntConRetencion = document.getElementById('idConRetencion');
      elmntConRetencion.classList.remove('active');
      const elmntAdjComprobante = document.getElementById('idSeccAdjComprobante');
      elmntAdjComprobante.classList.add('col-md-6');
    } else {
      const elmntSinRetencion = document.getElementById('idSinRetencion');
      elmntSinRetencion.classList.remove('active');
      elmntSinRetencion.classList.add('disabled');
    }
  }

  checkTerminos(event) {
    if (event.target.checked) {
      this.disableBtnRegComp = false;
    } else {
      this.disableBtnRegComp = true;
    }
  }

  backDashboard() {
    this.modalRef.hide();
    // let planillaRequest: PlanillaRequest = new PlanillaRequest();
    // let cmbHeader: Sede;
    // cmbHeader = JSON.parse(localStorage.getItem('sede'));
    // planillaRequest.idCompania = cmbHeader.codigointsed_vch;
    // planillaRequest.idEmpresa = this.medicoUser.codper;
    // planillaRequest.estadoDocumento = ESTADO_POREMETIR;
    // planillaRequest.flagObservadas = TODAS_PLANILLAS;
    // planillaRequest.fechaInicio = '2018/01/01"';
    // planillaRequest.fechaFin = '2018/12/30';
    // planillaRequest.codGenerado = this.medicoUser.idlog_num;
    // planillaRequest.codEvento = EVE_EMITIDAS;

    // let planillaResponse: PlanillaResponse[];
    // this._springService.getPlanilla(planillaRequest).subscribe(
    //   (data: PlanillaResponse[]) => {
    //     planillaResponse = [];
    //     planillaResponse = data;
    //     this.medicoUser.planillaResponse = planillaResponse;
    //     localStorage.removeItem('medicoUser');
    //     localStorage.setItem('medicoUser', JSON.stringify(this.medicoUser));
    //     this._router.navigate(['./dashb']);
    //   },
    //   error => {
    //     console.error('Error al traer planillaResponse (backDashboard): ' + error);
    //   }
    // );
    this.limpiaCamposPE();
    window.location.reload();
    this._router.navigate(['./dashb']);
  }

  getFileNameComprobante(e) {
    this.divImagePdfComprobante = true;
    this.fileComprobante = e.target.files[0];
    console.log('size factura: ' + this.fileComprobante.size);
    const filename = e.target.files[0].name;
    document.getElementById('idNombreComprobante').innerHTML = filename;
    this.nameFIleComprobante = filename;
  }
  getFileNameRetencion(e) {
    this.divImagePdfRetencion = true;
    this.fileRetencion = e.target.files[0];
    const filename = e.target.files[0].name;
    this.nameFileRetencion = filename;
    document.getElementById('idNombreRetencion').innerHTML = filename;
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.fileComprobante = file;

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath) 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log('It isnt a File!! -- comprobante dropped');
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    const nombre = this.files[0].relativePath;
    document.getElementById('idNombreComprobante').innerHTML = nombre;
    this.divImagePdfComprobante = true;
    this.nameFIleComprobante = nombre;
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  retencionDropped(event: UploadEvent) {
    this.filesRetencion = event.files;

    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          this.fileRetencion = file;
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log('It isnt a File!! -- Retencion dropped');
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    const nombreRetencion = this.filesRetencion[0].relativePath;
    document.getElementById('idNombreRetencion').innerHTML = nombreRetencion;
    this.nameFileRetencion = nombreRetencion;
    this.divImagePdfRetencion = true;
  }

  // Evaluar eliminado
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  registrarProcesoEmision(tmpRegistroExitoso: TemplateRef<any>, tmpRegistroErroneo: TemplateRef<any>) {
    this.spinnerService.show();
    this.submitted = true;
    // certfObligatorio
    if (this.validaCampos()) {
      let idPlanillasConcat = '';

      for (let i = 0; i < this.listPlanillasRegistro.length; i++) {
        if (i === 0) {
          idPlanillasConcat = this.listPlanillasRegistro[i].idPlanilla;
        } else {
          idPlanillasConcat = idPlanillasConcat + ',' + this.listPlanillasRegistro[i].idPlanilla;
        }
      }

      let cmbHeader: Sede;
      cmbHeader = JSON.parse(localStorage.getItem('sede'));
      this.comprobanteProcesoE.idCompania = cmbHeader.codigointsed_vch;
      this.comprobanteProcesoE.tipoDocumento = this.medicoUser.flagComprobante;
      this.comprobanteProcesoE.idEmpresa = this.medicoUser.codper;
      this.comprobanteProcesoE.idPlanilla = idPlanillasConcat;
      // this.medicoUser.flagComprobante = 'RH'; //Eliminar
      this.comprobanteProcesoE.tipoDocumento = this.medicoUser.flagComprobante;
      this.comprobanteProcesoE.flagRetencion = this.medicoUser.flagRetencion;
      this.comprobanteProcesoE.idlog_num = this.medicoUser.idlog_num;
      // this.comprobanteProcesoE.flagRetencion = '2'; //Eliminar

      if (this.medicoUser.flagComprobante === DOCUMENTO_FACTURA) {
        this.fileRetencion = this.fileComprobante;
      }
      // 1: sin retencion(s, solo comprobante) 2: con retencion(N, registra certificado + comprobante)
      if (this.si_no_RHE === CLIC_SI_RHE) {
        this.fileRetencion = this.fileComprobante;
      }
      let envioFileRetencion = '';
      if (this.nameFileRetencion.length === 0) {
        this.fileRetencion = this.fileComprobante;
        envioFileRetencion = '1';
      } else {
        envioFileRetencion = '2';
      }

      this.disableBtnRegComp = true;

      this._springService
        .registrarProcesoEmision(this.fileComprobante, this.fileRetencion, envioFileRetencion, this.comprobanteProcesoE)
        .subscribe(event => {
          if (event.status === 200) {
            this.cargarDashboard();
            this.spinnerService.hide();
            this.modalRef = this.modalService.show(tmpRegistroExitoso);
            // this.limpiaCamposPE();
          } else {
            if (event.status === 401) {
              this._AutenticacionService.getCerrarSesion();
            } else {
              this.spinnerService.hide();
              this.modalRef = this.modalService.show(tmpRegistroErroneo);
            }

          }
          this.disableBtnRegComp = false;
        },
          error => {
            this.spinnerService.hide();
            console.log('ERROR!!!!');
            this.modalRef = this.modalService.show(tmpRegistroErroneo);
            this.disableBtnRegComp = false;
          });
      this.submitted = false;
    }
    // this.spinnerService.hide();
  }

  cargarDashboard() {
    let cmbHeader: Sede;
    cmbHeader = JSON.parse(localStorage.getItem('sede'));

    this.dashboard = new PlanillaRequest();
    this.dashboard.idCompania = cmbHeader.codigointsed_vch.toString();
    this.dashboard.idEmpresa = this.medicoUser.codper;
    this.dashboard.codGenerado = this.medicoUser.idlog_num;
    this.dashboard.codEvento = EVE_EMITIDAS;
    this._springService.getDashboard(this.dashboard)
      .subscribe(
        (data: DashboardMontosResponse) => {
          this.dashboardMontosResponse = data;
          localStorage.removeItem('montoPorEmitir');
          localStorage.removeItem('montoPorPagar');
          localStorage.setItem('montoPorEmitir', this.dashboardMontosResponse.montoPorEmitir);
          localStorage.setItem('montoPorPagar', this.dashboardMontosResponse.montoPorPagar);
        },
        error => {
          console.error(error);
        }
      );
  }

  validaCampos() {
    let serie = (<HTMLInputElement>document.getElementById('serieProceso')).value;
    let numero = (<HTMLInputElement>document.getElementById('numeroProceso')).value;
    let fechaEmision = (<HTMLInputElement>document.getElementById('fechaEmiProceso')).value;

    if (serie.length === 0) {
      return false;
    }

    if (numero.length === 0) {
      return false;
    }

    if (fechaEmision.length === 0) {
      return false;
    }

    if (this.nameFIleComprobante.length === 0) {
      this.toastr.error(MENSAJES.MSG_ADJ_COMPROBANTE, MENSAJES.TITULO_VALIDACION);
      return false;
    }
    // this.montoTotal = 1500;
    let montoInferior = this.medicoUser.montoMinimoRHE;
    if (this.montoTotal >= montoInferior) {
      this.certfObligatorio = true;
    }

    if (this.nameFileRetencion.length === 0
      && this.medicoUser.flagComprobante === DOCUMENTO_RHE
      && (this.si_no_RHE === CLIC_NO_RHE)
      && (this.certfObligatorio)) {
      this.toastr.error(MENSAJES.MSG_ADJ_CERTIFICADO, MENSAJES.TITULO_VALIDACION);

      return false;
    }

    if (this.medicoUser.flagComprobante === DOCUMENTO_RHE
      && (this.si_no_RHE === CLIC_NO_RHE)
      && (this.certfObligatorio)) {

      let numeroCert = (<HTMLInputElement>document.getElementById('numCertfNR')).value;
      if (numeroCert.length === 0) {
        return false;
      }
    }

    if (!(this.nameFileRetencion.length === 0) && this.si_no_RHE === CLIC_NO_RHE) {
      // this.certfObligatorio = true;
      let numeroCert = (<HTMLInputElement>document.getElementById('numCertfNR')).value;
      if (numeroCert.length === 0) {
        return false;
      }
    }

    if (this.listPlanillasRegistro.length === 0) {
      this.toastr.error(MENSAJES.MSG_VALIDA_PLANILLA, MENSAJES.TITULO_VALIDACION);
      return false;
    }

    return true;
  }

  limpiaCamposPE() {

    if (this.si_no_RHE === CLIC_NO_RHE) {
      document.getElementById('idNombreComprobante').innerHTML = '';
      document.getElementById('idNombreRetencion').innerHTML = '';
    } else {
      document.getElementById('idNombreComprobante').innerHTML = '';
    }

    this.listPlanillasRegistro = [];
    this.comprobanteProcesoE = new ComprobanteRequest();
    this.fileComprobante = undefined;
    this.fileRetencion = undefined;
    this.divImagePdfComprobante = false;
    this.divImagePdfRetencion = false;
    this.nameFIleComprobante = '';
    this.nameFileRetencion = '';
    this.montoSubTotal = 0;
    this.montodescuento = 0;
    this.montoTotal = 0;
    localStorage.setItem(
      'listaPlanillaRegistro',
      JSON.stringify(this.listPlanillasRegistro)
    );

  }

}
