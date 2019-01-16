import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../services/persona.service';
import { Persona } from '../dto/Persona.model';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {
  pers: Persona[];

  constructor(private personaService: PersonaService) { }

  ngOnInit() {
    this.getListaPersona();
  }

  getListaPersona() {
    return this.personaService.getListaPersona().subscribe(res => {
      this.pers = res;
      console.log(this.pers);
    });
  }

  generarPdf() {
    this.personaService.getPReportePlanillaPdf()
      .subscribe(
        (res) => {
          /*const elem = window.document.createElement('a');
          elem.id = 'planillasId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'planillas.pdf';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');*/
          var file = new Blob([res], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "EPrescription");
        }, error => {
          console.log(error);
        }
      );
  }



  generarXlsx() {
    this.personaService.getPReportePlanillaXlsx()
      .subscribe(
        (res) => {
          const elem = window.document.createElement('a');
          elem.id = 'planillasId1';
          elem.href = window.URL.createObjectURL(res);
          elem.download = 'planillas.xlsx';
          document.body.appendChild(elem);
          elem.click();
          console.log('fin download pdf');
        }, error => {
          console.log(error);
        }
      );
  }


  generarHtml() {
    this.personaService.getPReportePlanillaHtml()
      .subscribe(
        (res) => {
          var file = new Blob([res], { type: 'text/html' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL, "EPrescription");
          /*if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveBlob(file,'planilla.pdf'); // for IE browser
          } else {
            var url = URL.createObjectURL(file);
            var a = document.createElement("a");
            document.body.appendChild(a);
            //a.style = "display: none";
            a.href = url;
            a.download = 'planilla.pdf';
            a.target = '_blank';
            a.click();
          }*/


        }, error => {
          console.log(error);
        }
      );
  }

  prepareQRForPrint() {
    return "<html><head><style type='text/css' media='print'>@media print { @page { size: auto; margin: 0;} body { margin:1.6cm; } }</style><script>\n" +
      "\n" +
      "\n" +
      "</script></head><body onload='step1()'>\n" +
      "<img style='width:800px;height:1000px;' src='' /></body></html>"
  }

  printPreviewQR() {
    let Pagelink = "about:blank";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();

    pwa.document.write(this.prepareQRForPrint());
    pwa.document.close();
  }

}
