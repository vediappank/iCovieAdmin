// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';

import { UserManagementModule } from './user-management/user-management.module';
import { UserProfileModule } from './userprofile/userprofile.module';
import { ReportsModule } from './reports/reports.module';



import { MyPageComponent } from './my-page/my-page.component';
import { MastersModule } from './masters/masters.module';

@NgModule({
	declarations: [MyPageComponent],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,	
		ReportsModule,
		UserManagementModule,
		MastersModule,
		UserProfileModule
	],
	providers: []
})
export class PagesModule {
}
