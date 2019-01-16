import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { webServiceEndpoint } from '../common';
import * as CryptoJS from 'crypto-js';
import 'rxjs/add/operator/map';

// Request-Response
import { LoginRequest } from '../dto/LoginRequest';
import { MedicoResponse } from '../dto/MedicoResponse';
@Injectable()
export class AutenticacionService {

    constructor(private http: Http, public _router: Router) { }

    getIniciarSesion(loginUser: LoginRequest) {
        // loginUser.passwordhash = CryptoJS.SHA256(loginUser.password).toString(CryptoJS.enc.Hex);
        loginUser.passwordhash = CryptoJS.SHA1(loginUser.password).toString(CryptoJS.enc.Hex).toUpperCase();
        console.log('sha256: ' + CryptoJS.SHA256(loginUser.password));
        console.log('sha1: ' + CryptoJS.SHA1(loginUser.password).toString(CryptoJS.enc.Hex).toUpperCase());

        return this.http.post(webServiceEndpoint.concat('api/loginWeb'), loginUser)
        .map((res => <MedicoResponse>res.json()));
    }

    getCerrarSesion() {
        localStorage.clear();
        this._router.navigate(['/login']);
    }

    handleError(error: any): Observable<string> {
        return Observable.throw(error.json() || 'Server error');
    }
}
