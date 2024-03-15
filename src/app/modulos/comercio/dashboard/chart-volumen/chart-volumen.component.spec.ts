import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVolumenComponent } from './chart-volumen.component';

describe('ChartVolumenComponent', () => {
  let component: ChartVolumenComponent;
  let fixture: ComponentFixture<ChartVolumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartVolumenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartVolumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
