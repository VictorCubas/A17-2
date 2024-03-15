import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FinderAutocompleteComponent} from './finder-autocomplete.component';

describe('FinderAutocompleteComponent', () => {
    let component: FinderAutocompleteComponent<any>;
    let fixture: ComponentFixture<FinderAutocompleteComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinderAutocompleteComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FinderAutocompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
