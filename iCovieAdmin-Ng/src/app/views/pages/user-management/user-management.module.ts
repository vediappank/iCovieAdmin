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
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './Administrator/users/users-list/users-list.component';
import { UserEditComponent } from './Administrator/users/user-edit/user-edit.component';
import { RolesListComponent } from './Administrator/roles/roles-list/roles-list.component';
import { RoleEditDialogComponent } from './Administrator/roles/role-edit/role-edit.dialog.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreetableModule } from 'ng-material-treetable';
import {MatTreeModule} from '@angular/material/tree';
import { CompanylistComponent } from './company/companylist/companylist.component';
import { CompanyeditComponent } from './company/companyedit/companyedit.component';
import { LocationlistComponent } from './location/locationlist/locationlist.component';
import { LocationeditComponent } from './location/locationedit/locationedit.component';
import { BuildinglistComponent } from './building/buildinglist/buildinglist.component';
import { BuildingeditComponent } from './building/buildingedit/buildingedit.component';
import { FloorlistComponent } from './floor/floorlist/floorlist.component';
import { FlooreditComponent } from './floor/flooredit/flooredit.component';
import { WinglistComponent } from './wing/winglist/winglist.component';
import { WingeditComponent } from './wing/wingedit/wingedit.component';
import { wingtypelistcomponent } from './wingtype/wingtypelist/wingtypelist.component';
import { wingtypeeditcomponent } from './wingtype/wingtypeedit/wingtypeedit.component';





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
	UserEffects
} from '../../../core/auth';
import { ConsolidatePagesComponent } from './FacilitiesList/consolidate-pages.component';
import { timezonelistcomponent } from './timezone/timezonelist/timezonelist.component';
import { timezoneeditcomponent } from './timezone/timezoneedit/timezoneedit.component';
import { CitylistComponent } from './city/citylist/citylist.component';
import { cityeditcomponent } from './city/cityedit/cityedit.component';
import { countrylistcomponent } from './country/countrylist/countrylist.component';
import { countryeditcomponent } from './country/countryedit/countryedit.component'
import { regionlistcomponent } from './region/regionlist/regionlist.component';
import { regioneditcomponent } from './region/regionedit/regionedit.component';
import { statelistcomponent } from './state/statelist/statelist.component';
import { stateeditcomponent } from './state/stateedit/stateedit.component';
import { GeographicslistComponent } from './geographicslist/geographicslist.component';
import { AdministratorlistComponent } from './administratorlist/administratorlist.component';


const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'roles',
				component: RolesListComponent
			},
			{
				path: 'commonpage',
				component: ConsolidatePagesComponent
			},
			{
				path: 'users',
				component: UsersListComponent
			},
			{
				path: 'users:id',
				component: UsersListComponent
			},
			{
				path: 'users/add',
				component: UserEditComponent
			},
			{
				path: 'users/add:id',
				component: UserEditComponent
			},
			{
				path: 'users/edit',
				component: UserEditComponent
			},
			{
				path: 'users/edit/:id',
				component: UserEditComponent
			},
			{
			  path: 'company',
			  component: CompanylistComponent
			},
			{
			  path: 'location',
			  component: LocationlistComponent
			},
			{
			  path: 'building',
			  component: BuildinglistComponent
			},
			{
			  path: 'floor',
			  component: FloorlistComponent
			},
			{
			  path: 'wing',
			  component: WinglistComponent
			},
			{
			  path: 'timezone',
			  component: timezonelistcomponent
			},
			{
			  path: 'region',
			  component: regionlistcomponent
			},
			{
			  path: 'country',
			  component: countrylistcomponent
			},
			{
			  path: 'state',
			  component: statelistcomponent
			},
			{
			  path: 'city',
			  component: CitylistComponent
			},
			{
			  path: 'geographicslist',
			  component: GeographicslistComponent
			},
			{
			  path: 'wingtype',
			  component: wingtypelistcomponent
			}
			,
			{
			  path: 'administratorlist',
			  component: AdministratorlistComponent
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
		RoleEditDialogComponent,
		CompanyeditComponent,
		LocationeditComponent,
		BuildingeditComponent,
		FlooreditComponent,
		WingeditComponent,
		timezoneeditcomponent,
		stateeditcomponent,
		countryeditcomponent,
		regioneditcomponent,
		wingtypeeditcomponent,
		cityeditcomponent
	],
	declarations: [
		UserManagementComponent, 
		UsersListComponent,
		UserEditComponent,
		RolesListComponent,
		RoleEditDialogComponent, CompanylistComponent, CompanyeditComponent, 
		LocationlistComponent, LocationeditComponent, 
		BuildinglistComponent, BuildingeditComponent, 
		FloorlistComponent, FlooreditComponent, 
		WinglistComponent, WingeditComponent, ConsolidatePagesComponent,
		 timezonelistcomponent, timezoneeditcomponent, 
		 CitylistComponent, cityeditcomponent, 
		 countrylistcomponent, countryeditcomponent, 
		 regionlistcomponent, regioneditcomponent, 
		 statelistcomponent, stateeditcomponent, GeographicslistComponent,		 
    wingtypelistcomponent,
    wingtypeeditcomponent,
    AdministratorlistComponent
 
	]
})
export class UserManagementModule {}
