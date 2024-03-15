import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadCreditosEstadoComponent } from './cantidad-creditos-estado.component';

describe('CantidadCreditosEstadoComponent', () => {
  let component: CantidadCreditosEstadoComponent;
  let fixture: ComponentFixture<CantidadCreditosEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantidadCreditosEstadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CantidadCreditosEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
