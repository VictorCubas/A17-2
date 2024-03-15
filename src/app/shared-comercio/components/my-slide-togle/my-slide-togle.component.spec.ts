import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MySlideTogleComponent} from './my-slide-togle.component';

describe('MySlideTogleComponent', () => {
    let component: MySlideTogleComponent;
    let fixture: ComponentFixture<MySlideTogleComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MySlideTogleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MySlideTogleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
