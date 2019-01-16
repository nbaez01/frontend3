import { Component, OnInit } from '@angular/core';

interface Alert {
  type: string;
  message: string;
}

const ALERTA_LOGIN : Alert = {
  type: 'danger',
  message: 'Error con las credenciales',
};

@Component({
  selector: 'ng-alert-login',
  templateUrl: './alert-login.component.html',
  styleUrls: ['./alert-login.component.css']
})
export class AlertLoginComponent implements OnInit {
  
  staticAlertClosed : boolean = false;
  alertaLogin: Alert;

  constructor() {
    this.mostrarAlertita();
   }

  ngOnInit() {
  }

  close(alert: Alert) {
    this.staticAlertClosed = true;
  }

  mostrarAlertita() {
    this.alertaLogin = ALERTA_LOGIN;
  }

}
