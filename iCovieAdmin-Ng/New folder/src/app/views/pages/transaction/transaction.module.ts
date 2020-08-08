// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { MatTreeModule } from '@angular/material/tree';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatListModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


import { TransactionComponent } from './transaction.component';
import { RenovationlistComponent } from './renovation/renovationlist/renovationlist.component';
import { RenovationeditComponent } from './renovation/renovationedit/renovationedit.component';
import { RenovationtasklistComponent } from './renovationtask/renovationtasklist/renovationtasklist.component';
import { RenovationtaskeditComponent } from './renovationtask/renovationtaskedit/renovationtaskedit.component';





const routes: Routes = [
  {
    path: '',
    component: TransactionComponent,
    children: [
      {
        path: '',
        redirectTo: 'renovation',
        pathMatch: 'full'
      },
      {
        path: 'renovation',
        component: RenovationlistComponent
      },
      {
        path: 'renovationtask',
        component: RenovationtasklistComponent
      }     
      
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    FormsModule,
    MatTreeModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    NgxDaterangepickerMd,
    MatStepperModule
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent,
    RenovationeditComponent,
    RenovationtaskeditComponent 
  ],
  declarations: [
    TransactionComponent,
    RenovationlistComponent,
    RenovationeditComponent,
    RenovationtasklistComponent,
    RenovationtaskeditComponent,
       
   

  ]
})
export class TransactionModule { }
