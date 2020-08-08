// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// State
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {
	BusinessCategoryModel,
	MCompanyModel,
	Permission,
	selectBusinessCategoryById,
	BusinessCategoryUpdated,
	selectAllPermissions,
	selectAllBusinessCategorys,

	selectLastCreatedBusinessCategoryId,
	BusinessCategoryOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-businesscategoryedit',
  templateUrl: './businesscategoryedit.component.html',
  styleUrls: ['./businesscategoryedit.component.scss']
})
export class BusinesscategoryeditComponent implements OnInit {


	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);

	allLocations: MLocationModel[] = [];
	unassignedLocations: MLocationModel[] = [];
	assignedLocations: MLocationModel[] = [];
	LocationIdForAdding: number;
	LocationsSubject = new BehaviorSubject<number[]>([]);

	BusinessCategory: BusinessCategoryModel;
	BusinessCategory$: Observable<BusinessCategoryModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CompanyID: any;
	LocationID: any;
	selectedCompany: string;
	selectedLocation: string;
	public defaultLocations = [];
	public filterLocations = [];
	companyid: number;
	locationid: number;

	public defaultCompanys = [];
	public AdmindefaultCompanys = [];
	isadmin: any;
	
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<BusinessCategoryeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<BusinesscategoryeditComponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getCompanyLocation = this.auth.getItems();
		this.CompanyID = getCompanyLocation[0].CompanyID;
		this.LocationID = getCompanyLocation[0].LocationID;
		console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));
	}

	/**
	 * On init
	 */
	ngOnInit() {
   
		if (localStorage.hasOwnProperty('currentUser')) {
			this.CompanyID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}	
		
		if (this.data.id) {

			this.BusinessCategory$ = this.store.pipe(select(selectBusinessCategoryById(this.data.id)));
		} else {

			const newBusinessCategory = new BusinessCategoryModel();
			newBusinessCategory.clear();
			this.BusinessCategory$ = of(newBusinessCategory);
		}
		this.BusinessCategory$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.BusinessCategory = new BusinessCategoryModel();
			this.BusinessCategory.id = res.id;
      this.BusinessCategory.businesscategory = res.businesscategory;	
      
		});		
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}



	/**
	 * Returns BusinessCategory for save
	 */
	prepareBusinessCategory(): BusinessCategoryModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _BusinessCategory = new BusinessCategoryModel();
	

		_BusinessCategory.id = this.BusinessCategory.id;
    _BusinessCategory.businesscategory = this.BusinessCategory.businesscategory;
    
		
		// _BusinessCategory.companyid = this.BusinessCategory.companyid;
		// _BusinessCategory.locationid = this.BusinessCategory.locationid;
		_BusinessCategory.cid = loginid;
		return _BusinessCategory;
	}

	/**
	 * Save data
	 */
	onSubmit() {
		//
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedBusinessCategory = this.prepareBusinessCategory();
		if (editedBusinessCategory.id > 0) {
			this.updateBusinessCategory(editedBusinessCategory);
		} else {
			this.createBusinessCategory(editedBusinessCategory);
		}
	}

	/**
	 * Update BusinessCategory
	 *
	 * @param _BusinessCategory: BusinessCategory
	 */
	updateBusinessCategory(_BusinessCategory: BusinessCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateBusinessCategory(_BusinessCategory).subscribe(data => {
			console.log('UpdateBusinessCategory Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_BusinessCategory,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create BusinessCategory
	 *
	 * @param _BusinessCategory: BusinessCategory
	 */
	createBusinessCategory(_BusinessCategory: BusinessCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createBusinessCategory(_BusinessCategory).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_BusinessCategory,
				isEdit: false
			});
		});
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}


	getLocationByCompany() {
		if (this.allLocations.length > 0) {
			this.unassignedLocations = this.allLocations.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.LocationIdForAdding = this.unassignedLocations[0].id;
	}
	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.BusinessCategory && this.BusinessCategory.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit BusinessCategory '${this.BusinessCategory.businesscategory}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New BusinessCategory';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.BusinessCategory && this.BusinessCategory.businesscategory.length > 0);
		// return (this.BusinessCategory && this.BusinessCategory.BusinessCategoryname && this.BusinessCategory.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}



