import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraccionamientoPlazoComponent } from './fraccionamiento-plazo.component';

describe('FraccionamientoPlazoComponent', () => {
  let component: FraccionamientoPlazoComponent;
  let fixture: ComponentFixture<FraccionamientoPlazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraccionamientoPlazoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FraccionamientoPlazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
