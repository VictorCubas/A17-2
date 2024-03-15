import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadSolicitudesMontoComponent } from './cantidad-solicitudes-monto.component';

describe('CantidadSolicitudesMontoComponent', () => {
  let component: CantidadSolicitudesMontoComponent;
  let fixture: ComponentFixture<CantidadSolicitudesMontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantidadSolicitudesMontoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CantidadSolicitudesMontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
