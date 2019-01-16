import { PlanillaResponse } from './PlanillaResponse';
export class ReportePlanillaRequest {
    reporte: any;
    usuario: string;
    tipo: string;
    planillas: PlanillaResponse[];
}
