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
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import { MatTreeModule } from '@angular/material/tree';

import { AminitieslistComponent } from './aminities/aminitieslist/aminitieslist.component';
import { AminitieseditComponent } from './aminities/aminitiesedit/aminitiesedit.component';
import { AminitiesneighbourhoodlistComponent } from './aminitiesneighbourhood/aminitiesneighbourhoodlist/aminitiesneighbourhoodlist.component';
import { AminitiesneighbourhoodeditComponent } from './aminitiesneighbourhood/aminitiesneighbourhoodedit/aminitiesneighbourhoodedit.component';
import { AminitiestypelistComponent } from './aminitiestype/aminitiestypelist/aminitiestypelist.component';
import { AminitiestypeeditComponent } from './aminitiestype/aminitiestypeedit/aminitiestypeedit.component';
import { BedtypelistComponent } from './bedtype/bedtypelist/bedtypelist.component';
import { BedtypeeditComponent } from './bedtype/bedtypeedit/bedtypeedit.component';
import { BusinesscategorylistComponent } from './businesscategory/businesscategorylist/businesscategorylist.component';
import { BusinesscategoryeditComponent } from './businesscategory/businesscategoryedit/businesscategoryedit.component';
import { GuesttypelistComponent } from './guesttype/guesttypelist/guesttypelist.component';
import { GuesttypeeditComponent } from './guesttype/guesttypeedit/guesttypeedit.component';
import { PropertylistComponent } from './property/propertylist/propertylist.component';
import { PropertyeditComponent } from './property/propertyedit/propertyedit.component';
import { PropertycartegorylistComponent } from './propertycategory/propertycartegorylist/propertycartegorylist.component';
import { PropertycategoryeditComponent } from './propertycategory/propertycategoryedit/propertycategoryedit.component';
import { PropertytypelistComponent } from './propertytype/propertytypelist/propertytypelist.component';
import { PropertytypeeditComponent } from './propertytype/propertytypeedit/propertytypeedit.component';
import { SignuplistComponent } from './signup/signuplist/signuplist.component';
import { SignupeditComponent } from './signup/signupedit/signupedit.component';





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

} from '@angular/material';
import {
  usersReducer,
  UserEffects,
  NeighbourhoodCategoryModel
} from '../../../core/auth';
import { MastersComponent } from './masters.component';
import {
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../views/partials/content/crud';
import { NeighbourhoodcategoryComponent } from './neighbourhoodcategory/neighbourhoodcategory/neighbourhoodcategory.component';
import { NeighbourhoodcategoryeditComponent } from './neighbourhoodcategory/neighbourhoodcategoryedit/neighbourhoodcategoryedit.component';

import { PropertysetuppageslistComponent } from './propertysetuppageslist/propertysetuppageslist.component';
import { AmenitiessetuppageslistComponent } from './amenitiessetuppageslist/amenitiessetuppageslist.component';
import { NeighbourssetuppageslistComponent } from './neighbourssetuppageslist/neighbourssetuppageslist.component';



const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    children: [
      {
        path: '',
        redirectTo: 'aminities',
        pathMatch: 'full'
      },
      {
        path: 'aminities',
        component: AminitieslistComponent
      },
      {
        path: 'neighbourhoodtype',
        component: AminitiesneighbourhoodlistComponent
      },
      {
        path: 'aminitiestype',
        component: AminitiestypelistComponent
      },
      {
        path: 'bedtype',
        component: BedtypelistComponent
      },
      {
        path: 'businesscategory',
        component: BusinesscategorylistComponent
      },
      {
        path: 'guesttype',
        component: GuesttypelistComponent
      },
      {
        path: 'property',
        component: PropertylistComponent
      },
      {
        path: 'propertycategory',
        component: PropertycartegorylistComponent
      },
      {
        path: 'propertytype',
        component: PropertytypelistComponent
      },
      {
        path: 'signup',
        component: SignuplistComponent
      },
      {
        path: 'neighbourhoodcategory',
        component: NeighbourhoodcategoryComponent
      },
      {
        path: 'neighbourhoodpagessettings',
        component: NeighbourssetuppageslistComponent
      },
      {
        path: 'amenitiespagessettings',
        component: AmenitiessetuppageslistComponent
      },
      {
        path: 'propertypagessettings',
        component: PropertysetuppageslistComponent
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
    TreetableModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
    BsDatepickerModule.forRoot(),
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
    MatDialogModule
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
        width: '1000px'
      }
    },
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent,
    AminitieseditComponent,
    AminitiesneighbourhoodeditComponent,
    AminitiestypeeditComponent,
    BedtypeeditComponent,
    BusinesscategoryeditComponent,
    GuesttypeeditComponent,
    PropertyeditComponent,
    PropertycategoryeditComponent,
    PropertytypeeditComponent,
    SignupeditComponent,
    NeighbourhoodcategoryeditComponent,
    DeleteEntityDialogComponent
  ],
  declarations: [
    MastersComponent,
    AminitieslistComponent,
    AminitieseditComponent,
    AminitiesneighbourhoodlistComponent,
    AminitiesneighbourhoodeditComponent,
    AminitiestypelistComponent,
    AminitiestypeeditComponent,
    BedtypelistComponent,
    BedtypeeditComponent,
    BusinesscategorylistComponent,
    BusinesscategoryeditComponent,
    GuesttypelistComponent,
    GuesttypeeditComponent,
    PropertylistComponent,
    PropertyeditComponent,
    PropertycartegorylistComponent,
    PropertycategoryeditComponent,
    PropertytypelistComponent,
    PropertytypeeditComponent,
    SignuplistComponent,
    SignupeditComponent,
    NeighbourhoodcategoryComponent,
    NeighbourhoodcategoryeditComponent,   
    PropertysetuppageslistComponent,   
    AmenitiessetuppageslistComponent,
    NeighbourssetuppageslistComponent

  ]
})
export class MastersModule { }




