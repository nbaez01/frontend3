import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

// Request-Response
import { LoginRequest } from '../dto/LoginRequest';
import { MedicoResponse } from '../dto/MedicoResponse';
import { DashboardResponse } from '../dto/DashboardResponse';
// Service
import { AutenticacionService } from '../services/autenticacion.service';
import { Sede } from '../dto/Sede';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AutenticacionService]
})
export class LoginComponent implements OnInit {

  valForm: FormGroup;
  public loginUser: LoginRequest = new LoginRequest();
  public medicoUser: MedicoResponse = new MedicoResponse();
  public sumited: boolean;
  public cmbHeader: Sede;
  public boxAlerta: boolean;
  public msgBoxAlerta: string;
  constructor(
    private _AutenticacionService: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _http: Http,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    fb: FormBuilder
  ) {
    this.valForm = fb.group({
      // 'user': ['', [Validators.required,Validators.email]],
      'user': ['', [Validators.required]],
      'pass': ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.msgBoxAlerta = '';
    this.boxAlerta = false;
  }

  loginValidation($ev, value: any) {
    $ev.preventDefault();
    // this.spinnerService.show();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.loginSesion();
      this.sumited = false;
    } else {
      this.sumited = true;
      // this.spinnerService.hide();
    }
  }

  loginSesion(): void {
    this.spinnerService.show();
    this.boxAlerta = false;
    // console.log('Valor del formulario' + this.valForm.value);
    // alert('<1>' + JSON.stringify(this.loginUser));
    //CARGA DE DATOS DE NAVEGACION
    this.loginUser.navegador = this.navegador();
    this.loginUser.dispositivo = this.equipo();

    this._AutenticacionService.getIniciarSesion(this.loginUser).subscribe(
        (data: MedicoResponse) => {
          this.medicoUser = data;
          if (this.medicoUser.idlog_num !== -1) {
            if (this.medicoUser.dashboardResponse !== null) {
              if (this.medicoUser.dashboardResponse.genero === 'F') {
                this.medicoUser.titulo = 'Dra.';
              } else {
                this.medicoUser.titulo = 'Dr.';
              }
              localStorage.setItem('medicoUser', JSON.stringify(this.medicoUser));
              localStorage.setItem('montoPorEmitir', this.medicoUser.porEmitir);
              localStorage.setItem('montoPorPagar', this.medicoUser.porPagar);
              localStorage.setItem('montoPagado', this.medicoUser.pagada);
              // console.log(this.medicoUser.dashboardResponse.genero);
              this.cmbHeader = this.medicoUser.sede[3];
              localStorage.setItem('sede', JSON.stringify(this.cmbHeader));
              this.spinnerService.hide();
              this._router.navigate(['./dashb']);
              console.log(' > Idlog_num : ' + this.medicoUser.idlog_num);
              console.log(' > login : ' + this.medicoUser.login);
              console.log(' > codper : ' + this.medicoUser.codper);
            } else {
              this.spinnerService.hide();
              this.msgBoxAlerta = 'El usuario no cuenta con liquidaciones';
              this.boxAlerta = true;
            }
          } else {
            this.spinnerService.hide();
            this.msgBoxAlerta = 'Usuario y/o contraseña incorrecta.';
            this.boxAlerta = true;
          }
        },
        error => {
          this.spinnerService.hide();
          console.error(error.statusText);
          this.loginUser = new LoginRequest();
          /*if (error.status === 404) {*/
          this.msgBoxAlerta = 'Ocurrio un inconveniente. Por favor intentar ingresar en un momentos o contactar a Mesa de Ayuda';
          this.boxAlerta = true;
          /*} else {
            this.msgBoxAlerta = 'Usuario y/o contraseña incorrecta.';
          }*/
        }
      );
  }

  navegador() {
    var getBrowserInfo = function () {
      var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

      return M.join(' ');
    };
    return getBrowserInfo();
  }

  equipo() {
    var ua = navigator.userAgent;
    // return ua.match(/\((.*)\)/).pop();
    return ua;
  }

  logoutSesion(): void {
    this._AutenticacionService.getCerrarSesion();
  }
}
