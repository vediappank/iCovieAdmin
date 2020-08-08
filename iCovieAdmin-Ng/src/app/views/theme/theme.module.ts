import { NgxPermissionsModule } from 'ngx-permissions';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Angular Material


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
	MatTooltipModule
  } from '@angular/material';
// NgBootstrap
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Translation
import { TranslateModule } from '@ngx-translate/core';
// Loading bar
import { LoadingBarModule } from '@ngx-loading-bar/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Ngx DatePicker
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Core Module
import { CoreModule } from '../../core/core.module';
import { HeaderComponent } from './header/header.component';
import { AsideLeftComponent } from './aside/aside-left.component';
import { FooterComponent } from './footer/footer.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { BrandComponent } from './brand/brand.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { PartialsModule } from '../partials/partials.module';
import { BaseComponent } from './base/base.component';
import { PagesModule } from '../pages/pages.module';
import { HtmlClassService } from './html-class.service';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
import { PermissionEffects,
	 permissionsReducer, RoleEffects, rolesReducer } from '../../core/auth';


import { 
	

	CompanyEffects,CompanyReducer,
	LocationEffects,LocationReducer,
	BuildingEffects, BuildingReducer,
	FloorEffects, FloorReducer,
	 WingEffects,WingReducer,
	 TimeZoneEffects,TimeZoneReducer,
	 RegionEffects,RegionReducer,
	 CountryEffects,CountryReducer,
	 StateEffects,StateReducer,
	 CityEffects,CityReducer,
	 AminitiesEffects,AminitiesReducer,
	 AminitiesTypeEffects,AminitiesTypeReducer,
	 AminitiesNeighbourhoodEffects,AminitiesNeighbourhoodReducer,
	 BedTypeEffects,BedTypeReducer,
	 BusinessCategoryEffects,BusinessCategoryReducer,
	 GuestTypeEffects,GuestTypeReducer,
	 PropertyEffects,PropertyReducer,
	 PropertyCategoryEffects,PropertyCategoryReducer,
	 PropertyTypeEffects,PropertyTypeReducer,
	 SignupEffects,SignupReducer,
	 WingTypeEffects,WingTypeReducer,
	 NeighbourhoodCategoryEffects,NeighbourhoodCategoryReducer
 } from '../../core/auth';
import { CompanyLocationConfigComponent } from './company-location-config/company-location-config.component';



@NgModule({
	declarations: [
		BaseComponent,
		FooterComponent,

		// headers
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,

		// subheader
		SubheaderComponent,

		// topbar components
		TopbarComponent,

		// aside left menu components
		AsideLeftComponent,

		// horizontal menu components
		MenuHorizontalComponent,

		ErrorPageComponent,

		CompanyLocationConfigComponent,
	],
	exports: [
		BaseComponent,
		FooterComponent,

		// headers
		HeaderComponent,
		BrandComponent,
		HeaderMobileComponent,

		// subheader
		SubheaderComponent,

		// topbar components
		TopbarComponent,

		// aside left menu components
		AsideLeftComponent,

		// horizontal menu components
		MenuHorizontalComponent,

		ErrorPageComponent,
	],
	providers: [
		HtmlClassService,
	],
	imports: [
		CommonModule,
		RouterModule,
		NgxPermissionsModule.forChild(),
		StoreModule.forFeature('roles', rolesReducer),
		StoreModule.forFeature('permissions', permissionsReducer),		
		
	
		StoreModule.forFeature('companys', CompanyReducer),
		StoreModule.forFeature('locations', LocationReducer),
		StoreModule.forFeature('buildings', BuildingReducer),
		StoreModule.forFeature('floors', FloorReducer),
		StoreModule.forFeature('wings', WingReducer),	
		StoreModule.forFeature('timezones', TimeZoneReducer),	
		StoreModule.forFeature('regions', RegionReducer),	
		StoreModule.forFeature('countrys',CountryReducer),	
		StoreModule.forFeature('states', StateReducer),	
		StoreModule.forFeature('citys', CityReducer),	
		StoreModule.forFeature('aminitiess', AminitiesReducer),	
		StoreModule.forFeature('aminitiesneighbourhoods', AminitiesNeighbourhoodReducer),	
		StoreModule.forFeature('aminitiestypes', AminitiesTypeReducer),	
		StoreModule.forFeature('bedtypes', BedTypeReducer),	
		StoreModule.forFeature('businesscategorys', BusinessCategoryReducer),	
		StoreModule.forFeature('guesttypes', GuestTypeReducer),	
		StoreModule.forFeature('propertys', PropertyReducer),	
		StoreModule.forFeature('propertycategorys', PropertyCategoryReducer),	
		StoreModule.forFeature('propertytypes', PropertyTypeReducer),	
		StoreModule.forFeature('signups', SignupReducer),	
		StoreModule.forFeature('wingtypes', WingTypeReducer),	
		StoreModule.forFeature('neighbourhoodcategorys', NeighbourhoodCategoryReducer),	
		EffectsModule.forFeature([PermissionEffects, RoleEffects,
			CompanyEffects,LocationEffects, BuildingEffects, FloorEffects,WingEffects,
			TimeZoneEffects,RegionEffects,CountryEffects,StateEffects,CityEffects, AminitiesEffects, AminitiesNeighbourhoodEffects, AminitiesTypeEffects,
		BedTypeEffects,BusinessCategoryEffects,GuestTypeEffects,PropertyEffects,PropertyCategoryEffects,PropertyTypeEffects,SignupEffects,
		WingTypeEffects, NeighbourhoodCategoryEffects ]),		
		//EffectsModule.forFeature([ActivityEffects,ActivityEffects]),
		PagesModule,
		PartialsModule,
		CoreModule,
		PerfectScrollbarModule,
		FormsModule,
		MatProgressBarModule,
		MatTabsModule,
		MatButtonModule,
		MatTooltipModule,
		TranslateModule.forChild(),
		LoadingBarModule,
		NgxDaterangepickerMd,
		InlineSVGModule,
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
		// ng-bootstrap modules
		NgbProgressbarModule,
		NgbTooltipModule,
	]
})
export class ThemeModule {
}
