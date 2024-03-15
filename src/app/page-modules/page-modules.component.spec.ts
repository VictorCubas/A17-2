import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageModulesComponent } from './page-modules.component';

describe('PageModulesComponent', () => {
  let component: PageModulesComponent;
  let fixture: ComponentFixture<PageModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
