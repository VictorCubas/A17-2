import { Component, OnInit } from '@angular/core';

import {Formularios} from '../../../../_helpers/clases/formularios';
import {ComercioSucursal} from '../../../../clases/comercio-sucursal';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {SucursalService} from '../sucursal.service';

import {Observable, Subject, Subscriber, takeUntil} from 'rxjs';
import {BarrioService} from '../barrio.service';
import {Barrio} from '../../../../clases/barrio';
import {Pais} from '../../../../clases/pais';
import {Departamento} from '../../../../clases/departamento';
import {Ciudad} from '../../../../clases/ciudad';
import {PaisService} from '../pais.service';
import {DepartamentoService} from '../departamento.service';
import {SettingsService} from '../../../../services/settings.service';
import {CiudadService} from '../ciudad.service';
import {NotificacionesService} from '../../../../shared-comercio/services/notificaciones.service';
import {PageHeaderDataService} from '../../../../shared-comercio/services/page-header-data.service';
import {PageHeaderData} from '../../../../shared-comercio/components/forms-header/page-header-data';
import * as L from 'leaflet';
import {icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, Marker, Icon, tileLayer} from 'leaflet';
import {MapPoint} from '../../../../clases/map-point.model';

@Component({
  selector: 'app-sucursal-form',
  templateUrl: './sucursal-form.component.html',
  styleUrls: ['./sucursal-form.component.scss']
})
export class SucursalFormComponent  extends  Formularios<ComercioSucursal>  implements OnInit {
  paisSelected: Pais = new Pais();
  departamentoSelected: Departamento = new Departamento();
  ciudadSelected: Ciudad = new Ciudad();

  hidePass: boolean = false;
  edit!: boolean;
  unsubscribe$: Subject<any> = new Subject();
  isChecked = true;

    map: Map;
    mapPoint: MapPoint;
    options: MapOptions;
    lastLayer: any;

  constructor(
    public override router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public notificacionService: NotificacionesService,
    public override service: SucursalService,
    public paisService: PaisService,
    public departamentoService: DepartamentoService,
    public ciudadService: CiudadService,
    public serviceBarrio: BarrioService,
    private settings: SettingsService,
    private headerDataService: PageHeaderDataService,
  ) {
    super(router, dialog, 'comercio/comercio-sucursal', service, notificacionService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.edit = super.editar;
    super.formularioAbs = this.construirFormGroup();
    if (super.editar) {
      console.log('Item',this.service.getItem());
      super.formularioAbs.setValue(this.service.getItem());
      this.ciudadSelected = super.formularioAbs.controls['barrio'].value.ciudad;
      this.departamentoSelected = super.formularioAbs.controls['barrio'].value.ciudad.departamento;
      this.paisSelected = super.formularioAbs.controls['barrio'].value.ciudad.departamento.pais;
    } else {
      this.service.restartItem();
    }
    console.log(this.formularioAbs);
    console.log('abm',this.editar,this.abm);
    this.headerDataService.setHeaderData(new PageHeaderData('Sucursales', this.rutaPadre, true));
    //this.initializeDefaultMapPoint();
    this.initMap();

    // setTimeout( () => {
    //   this.departamentoService.getAll().pipe(takeUntil(this.unsubscribe$)).subscribe( (d: any) => {
    //     console.log(d);
    //   });
    // }, 1500);

      //this.initializeDefaultMapPoint();
      //this.initializeMapOptions();
      //this.initializeMap();

  }

  construirFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: [{value: '', disabled: super.dis}, Validators.required],
      calle1: [{value: '', disabled: super.dis}],
      calle2: [{value: '', disabled: super.dis}],
      calle3: [{value: '', disabled: super.dis}],
      numero: [{value: '', disabled: super.dis}],
      edificio: [{value: '', disabled: super.dis}],
      piso: [{value: '', disabled: super.dis}],
      descripcion: [{value: '', disabled: super.dis}],
      departamento: [{value: '', disabled: super.dis}],
      latitud: [{value: 0, disabled: super.dis}],
      longitud: [{value: 0, disabled: super.dis}],
      matriz: [{value: false, disabled: super.dis}],
      nro_sucursal: [{value: 0, disabled: super.dis}],
      cod_sucursal: [{value: 0, disabled: super.dis}],
      barrio: [{ value: '', disabled: super.dis }, Validators.required],
    });
  }

  getErrorMessage(cName: string): string | void {
    if (this.formularioAbs.controls[cName].hasError('required')) {
      return 'Campo requerido';
    }
  }
  /**
   * Método de reseteo de valores por defecto
   */
  nuevo(): void {
    this.formularioAbs.reset();
  }

  /**
   * Método para guardar un usuario
   * @returns void
   */
  override guardar(): void {
    this.submitted = true;
      if (!this.formularioAbs.valid) {
          this.submitted = false;
          return;
      }

    this.item = this.formularioAbs.value;

    console.log(super.item);

    const data = super.item;

    if (this.editar) {
      this.service.update(data).subscribe(
        () => {
          this.notificacionesService.success('Datos Guardados.');
          this.router.navigate([`/${this.rutaPadre}`]);
        },
        () => (this.submitted = false),
        () => (this.submitted = false)
      );
    } else {
      this.service.save(data).subscribe(
        (res) => {
          this.notificacionesService.success('Datos Guardados.');
          console.log(res);
          this.cancelar();
        },
        () => (this.submitted = false),
        () => (this.submitted = false)
      );
    }
  }

 /* onBarrioSelectionChanged(event:any) {
    const selectedValue = event;
    console.log(selectedValue);
  }*/

  /**
   * Setea el valor del país seleccionado en la variable temporal y limpia el departamento seleccinado y con él su.
   * filtro
   * @param $event Objeto país retornado por un app-finder-autocomplete
   */
  seleccionaPais($event: Pais): void {
    this.paisSelected = $event;
    this.seleccionaDepartamento();
  }

  /**
   * Setea el valor del departamento seleccionado en la variable temporal y limpia la ciudad seleccinada y con ella su
   * filtro
   * @param $event Objeto país retornado por un app-finder-autocomplete
   */
  seleccionaDepartamento($event?: Departamento): void {
    this.departamentoSelected = $event ?? new Departamento();
    this.seleccionaCiudad();
  }

  /**
   * Setea el valor de la ciudad seleccionada en la variable temporal y limpia el barrio seleccinado y con él su
   * filtro.
   * @param $event Objeto país retornado por un app-finder-autocomplete
   */
  seleccionaCiudad($event?: Ciudad): void {
    //this.f.ciudad.setValue($event ?? new Ciudad());
    this.ciudadSelected=$event ?? new Ciudad();
    this.seleccionaBarrio();
  }

  seleccionaBarrio($event?: Barrio){
    this.formularioAbs.controls['barrio'].setValue($event ?? new Barrio())
  }

    private initMap(): void {
        this.map = L.map('map', {
            center: [ -25.2944, -57.6156 ],
            zoom: 10,
            renderer: L.canvas()
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 25,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
        //this.map.Control.geocoder().addTo(this.map)
     /*   this.map.on('locationfound', (e: any) =>{
            console.log('location',e)
        })*/

        if(super.editar){
            this.createMarker(this.formularioAbs.controls['latitud'].value,this.formularioAbs.controls['longitud'].value);
        }else{

            //this.createMarker(-25.2821543,-57.6372378)
            this.getCurrentPosition()
                .subscribe((position: any) => {
                    this.createMarker(position.latitude,position.longitude);
                    this.getGeoInversa(position.latitude,position.longitude);
                });
        }

    }

    private getCurrentPosition(): any {
        return new Observable((observer: Subscriber<any>) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position: any) => {
                    observer.next({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    observer.complete();
                });
            } else {
                observer.error();
            }
        });
    }


    getGeoInversa(latitude:number, longitude:number):any{
      this.service.geoInversa(latitude,longitude).subscribe((data:any)=>{
          if (data !== null) {
              //console.log('Item',this.service.getItem());
              //super.formularioAbs.setValue(this.service.getItem());
              //this.form.setValue(data[0]);
              super.formularioAbs.controls['calle1'].setValue(data.calle1)
              super.formularioAbs.controls['calle2'].setValue(data.calle2)
              this.formularioAbs.controls['latitud'].setValue(latitude);
              this.formularioAbs.controls['longitud'].setValue(longitude);


              this.paisSelected = new Pais(data.pais.id,data.pais.nombre);
              this.departamentoSelected = new Departamento(data.departamento.id,data.departamento.nombre,
                  new Pais(data.pais.id,data.pais.nombre));
              this.ciudadSelected = new Ciudad(data.ciudad.id,data.ciudad.nombre,'',this.departamentoSelected);
              console.log('selected',this.departamentoSelected)
              console.log('select',this.ciudadSelected)
              //this.paisSelected: Pais = new Pais(data.paisId);
              //super.formularioAbs.controls['barrio'].value.ciudad.departamento.pais=new Pais(data.paisId);

              console.log('Item',this.service.getItem());
              console.log(super.formularioAbs.value)
          }
      })
    }

    private createMarker(latitude:number, longitude:number) {
        var customIcon = new L.Icon({
            iconUrl: 'assets/icons/user.svg',
            iconSize: [50, 50],
            iconAnchor: [25, 50]
        });

        this.map.flyTo([latitude, longitude], 16);

    /*    this.formularioAbs.controls['latitud'].setValue(position.latitude);
        this.formularioAbs.controls['longitud'].setValue(position.longitude);*/

        const marker = L.marker([latitude, longitude],
            {icon: customIcon,draggable:this.abm ?true: false}).bindPopup('Tu Ubicación');
        marker.addTo(this.map);
        marker.on('dragend', (e) => {
            //console.log('mover', this.map.getBounds());
            console.log(marker.getLatLng().lat,marker.getLatLng().lng)
            this.getGeoInversa(marker.getLatLng().lat,marker.getLatLng().lng);
        });
    }
}
