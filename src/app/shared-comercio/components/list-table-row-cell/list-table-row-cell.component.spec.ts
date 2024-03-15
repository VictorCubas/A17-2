import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTableRowCellComponent} from './list-table-row-cell.component';

describe('ListTableRowCellComponent', () => {
    let component: ListTableRowCellComponent;
    let fixture: ComponentFixture<ListTableRowCellComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListTableRowCellComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListTableRowCellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
