import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
// modules
import { RoutesModule } from './hhmm/routes.module';
// components
import { LoginComponent } from './login/login.component';
import { NgxPopper } from 'angular-popper';
import { TestComponent } from './test/test.component';

import { FileDropModule } from 'ngx-file-drop';
import { ModalModule } from 'ngx-bootstrap/modal';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AlertLoginComponent } from './util/alert-login/alert-login.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PersonaComponent } from './persona/persona.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestComponent,
    AlertLoginComponent,
    PersonaComponent
  ],
  imports: [
    BrowserModule,
    RoutesModule,
    ReactiveFormsModule,
    HttpModule,
    NgxPopper,
    CommonModule,
    FileDropModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    NgbModule,
    BrowserAnimationsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
