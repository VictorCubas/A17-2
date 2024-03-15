import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioFormComponent } from './comercio-form.component';

describe('ComercioFormComponent', () => {
  let component: ComercioFormComponent;
  let fixture: ComponentFixture<ComercioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercioFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
