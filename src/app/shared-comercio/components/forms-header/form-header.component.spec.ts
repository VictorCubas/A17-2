import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormHeaderComponent} from './form-header.component';

describe('FormsHeaderComponent', () => {
    let component: FormHeaderComponent;
    let fixture: ComponentFixture<FormHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormHeaderComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
