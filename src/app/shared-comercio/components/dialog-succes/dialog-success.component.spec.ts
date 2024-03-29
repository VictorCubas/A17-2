import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogSuccessComponent} from './dialog-success.component';

describe('DialogSuccesComponent', () => {
    let component: DialogSuccessComponent;
    let fixture: ComponentFixture<DialogSuccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogSuccessComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
