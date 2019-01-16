import { from } from 'rxjs/observable/from';
import { DashboardResponse } from './DashboardResponse';
import { PlanillaResponse } from './PlanillaResponse';
import { Sede } from './Sede';
export class MedicoResponse {
    idlog_num: any;
    clave: string;
    apepat: string;
    apemat: string;
    login: string;
    codper: any;
    nombres: string;
    dashboardResponse: DashboardResponse;
    titulo: string;
    porEmitir: string;
    porPagar: string;
    pagada: string;
    planillaResponse: PlanillaResponse[];
    sede: Sede[];
    flagRetencion: string;
    flagComprobante: string;
    correoElectronico: string;
    montoMinimoRHE: string;
    terminosCondiciones: string;
}
