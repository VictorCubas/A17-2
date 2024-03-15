import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SnackbarService } from 'app/services/snackbar-service.service';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { DocumentoComercioService } from '../documento-comercio.service';

@Component({
  selector: 'app-adjuntar-form',
  templateUrl: './adjuntar-form.component.html',
  styleUrls: []
})
export class AdjuntarFormComponent implements OnInit {

  form!: FormGroup;
  tipoDocumentoList: any = [];
  unsubscribe$: Subject<any> = new Subject();

  preview: any = null;

  // objeto en edicion
  dataEdit: any = null;

  constructor(
    private fb: FormBuilder,
    private headerDataService: PageHeaderDataService,
    private documentoSvc: DocumentoComercioService,
    private snackbar: SnackbarService,
    private router: Router,
  ) {

    this.dataEdit = this.router.getCurrentNavigation()?.extras.state ?? null;
  }


  get f(): any{
    return this.form.controls;
  }

  ngOnInit(): void {
    this.headerDataService.setHeaderData(new PageHeaderData('Carga de Documentos', 'comercio/documentos', true, false));
    this.buildForm(this.dataEdit);
    this.getTipoDocumento();
  }

  buildForm(data: any = null): any {
    this.form = this.fb.group({
      tipo: [ data ? data.documentoTipo.id : '', Validators.required],
      file: [ data ? data.documentoUrl : null, Validators.required],
    });

    this.preview = data?.documentoUrl ?? null;

  }

  getTipoDocumento(): any {
    this.documentoSvc.getTipoDocumento().pipe(takeUntil(this.unsubscribe$)).subscribe( (resp: any) => {
      this.tipoDocumentoList = resp;
    });
  }


  async subirArchivo(e: any): Promise<any> {
    const files = e.srcElement.files;
    if (files) {
      this.preview = null;
      if (files[0].type.includes('image')) {
        this.preview = await this.blobToBase64(files[0]).then( data => data);
      }
      this.f['file'].setValue(files[0]);
    }
  }

  sendForm(): void {

    if (this.form.invalid) {
      this.snackbar.showMessage('Favor completar campos requeridos', 'warning');
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();

    const data = new FormData();

    data.append('documento', formData.file);

    this.documentoSvc.enviarArchivo(formData.tipo, data).pipe(takeUntil(this.unsubscribe$)).subscribe( () => {
      this.form.reset();
    });

  }

  blobToBase64(blob: Blob): any {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = (): any => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

}
