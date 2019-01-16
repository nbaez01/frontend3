

import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestComponent } from '../test/test.component';
import { DetalleComponent } from './detalle/detalle.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { PagadosComponent } from './pagados/pagados.component';
import { PorpagarComponent } from './porpagar/porpagar.component';
import { PersonaComponent } from '../persona/persona.component';

export const routes = [

    { path: 'login', component: LoginComponent },
    { path: 'dashb', component: DashboardComponent },
    { path: 'test', component: TestComponent },
    { path: 'deta', component: DetalleComponent },
    { path: 'proc', component: ProcesoComponent},
    { path: 'prpg', component: PorpagarComponent},
    { path: 'pagd', component: PagadosComponent},
    {path:'persona', component: PersonaComponent},
    { path: '**', redirectTo: 'persona' }

];
