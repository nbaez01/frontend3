import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { CommonModule } from '@angular/common';
// component
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetalleComponent } from './detalle/detalle.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { HeaderComponent } from '../header/header.component';

import { FileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';
import { PorpagarComponent } from './porpagar/porpagar.component';
import { PagadosComponent } from './pagados/pagados.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, {useHash: true}),
        FileDropModule,
        FormsModule,
        NgxPaginationModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgbModule
    ],
    declarations: [
        DashboardComponent,
        DetalleComponent,
        ProcesoComponent,
        HeaderComponent,
        PorpagarComponent,
        PagadosComponent
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {
    constructor() {
    }
}
