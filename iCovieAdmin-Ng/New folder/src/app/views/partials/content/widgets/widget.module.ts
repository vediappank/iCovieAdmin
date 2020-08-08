import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule, } from '@angular/material';
import { CoreModule } from '../../../../core/core.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Datatable
import { DataTableComponent } from './general/data-table/data-table.component';
// Ng2 Charts
import { ChartsModule } from 'ng2-charts';
// General widgets
import { Widget1Component } from './widget1/widget1.component';
import { Widget4Component } from './widget4/widget4.component';
import { Widget5Component } from './widget5/widget5.component';
import { Widget12Component } from './widget12/widget12.component';
import { Widget14Component } from './widget14/widget14.component';
import { Widget26Component } from './widget26/widget26.component';
import { Timeline2Component } from './timeline2/timeline2.component';



import { VariableRadiusPieWidgetComponent } from './variable-radius-pie-widget/variable-radius-pie-widget.component';

import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DataTableComponent,
    // Widgets
    Widget1Component,
    Widget4Component,
    Widget5Component,
    Widget12Component,
    Widget14Component,
    Widget26Component,
    Timeline2Component, 
    VariableRadiusPieWidgetComponent
  ],
  entryComponents: [
  
  ],
  exports: [
    DataTableComponent,
    // Widgets
    Widget1Component,
    Widget4Component,
    Widget5Component,
    Widget12Component,
    Widget14Component,
    Widget26Component,
    Timeline2Component
   
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    MatTableModule,
    CoreModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    ChartsModule,
    AngularDualListBoxModule,
    FormsModule
  ]
})
export class WidgetModule {
}
