import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogErrorComponent } from './components/dialog-error/dialog-error.component';
import { DialogSuccessComponent } from './components/dialog-succes/dialog-success.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { ListActionsComponent } from './components/list-actions/list-actions.component';
import { ListTableComponent } from './components/list-table/list-table.component';
import { ListTableRowCellComponent } from './components/list-table-row-cell/list-table-row-cell.component';
import { MatMenuModule } from '@angular/material/menu';
import { MySlideTogleComponent } from './components/my-slide-togle/my-slide-togle.component';
import { FormHeaderComponent } from './components/forms-header/form-header.component';
import { FormActionsComponent } from './components/form-actions/form-actions.component';
import { FlexModule } from '@angular/flex-layout';
import { FinderAutocompleteComponent } from './components/finder-autocomplete/finder-autocomplete.component';
import { CheckListComponent } from './components/check-list/check-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { MaterialModule } from 'app/material/material.module';

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogErrorComponent,
    DialogSuccessComponent,
    ListActionsComponent,
    ListTableComponent,
    ListTableRowCellComponent,
    MySlideTogleComponent,
    FormHeaderComponent,
    FormActionsComponent,
    FinderAutocompleteComponent,
    CheckListComponent,
  ],
  exports: [
    ListTableComponent,
    MySlideTogleComponent,
    FormHeaderComponent,
    FormActionsComponent,
    FinderAutocompleteComponent,
    CheckListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // MaterialModule,
    MatIconModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCardModule,
    MatOptionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatMenuModule,
    FlexModule,
    MatGridListModule,
  ],
})
export class SharedComercioModule {}
