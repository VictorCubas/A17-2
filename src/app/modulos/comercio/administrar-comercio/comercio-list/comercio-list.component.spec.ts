import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioListComponent } from './comercio-list.component';

describe('ComercioListComponent', () => {
  let component: ComercioListComponent;
  let fixture: ComponentFixture<ComercioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercioListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
