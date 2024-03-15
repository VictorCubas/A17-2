import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogErrorComponent} from './dialog-error.component';

describe('DialogErrorComponent', () => {
    let component: DialogErrorComponent;
    let fixture: ComponentFixture<DialogErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogErrorComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
