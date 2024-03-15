import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraUsuarioComponent } from './compra-usuario.component';

describe('CompraUsuarioComponent', () => {
  let component: CompraUsuarioComponent;
  let fixture: ComponentFixture<CompraUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
