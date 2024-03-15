import { Component, OnInit } from '@angular/core';
import {ApidocsService} from './apidocs.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-apidocs',
  templateUrl: './apidocs.component.html',
  styleUrls: ['./apidocs.component.scss']
})
export class ApidocsComponent implements OnInit {
  dataSource: any;
  constructor(
    private service: ApidocsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.obtenerURLDocumentacion();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private obtenerURLDocumentacion() {
    this.service.getURLDocumentacion()
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data !== null){
            this.dataSource = data;
            window.open(this.dataSource.url,'_blank');
            this.router.navigate(['/comercio/dashboard']);
          }
        });
  }

}
