import { PlanillaDetalleResponse } from './PlanillaDetalleResponse';
export class ReportePlanillaDetalleRequest {
    reporte: any;
    usuario: string;
    tipo: string;
    planillas: PlanillaDetalleResponse[];
}
