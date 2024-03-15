import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCreditoFormComponent } from './solicitud-credito-form.component';

describe('SolicitudCreditoFormComponent', () => {
  let component: SolicitudCreditoFormComponent;
  let fixture: ComponentFixture<SolicitudCreditoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudCreditoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCreditoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
