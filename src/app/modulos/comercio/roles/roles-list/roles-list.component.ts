import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageHeaderData } from 'app/shared-comercio/components/forms-header/page-header-data';
import { PageHeaderDataService } from 'app/shared-comercio/services/page-header-data.service';
import { Listas } from 'app/_helpers/clases/listas';
import { Rol } from 'app/clases/rol';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent extends Listas<Rol> implements OnInit {
  tableColumns: Array<any> = [
    { name: 'Nombre', val: 'nombre' },
    { name: 'Descripcion', val: 'descripcion' },
    { name: 'Módulo', val: 'modulo', nested: 'nombre', colSort: 'id' },
  ];

  constructor(
    public override router: Router,
    public service: RolesService,
    public dialog: MatDialog,
    private headerDataService: PageHeaderDataService
  ) {
    super(router, 'procesadora/roles', service, dialog);
  }

  ngOnInit(): void {

    this.getRoles();

    this.headerDataService.setHeaderData(
      new PageHeaderData('Roles', this.rutaPadre + '/registrar', false, true)
    );
  }

  getRoles(): any {
    this.service.obtenerRol({}).subscribe( (resp: any) => {
      this.lista = resp;
    });
  }

}
