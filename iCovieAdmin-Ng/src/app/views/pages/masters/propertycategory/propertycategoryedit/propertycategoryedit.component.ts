
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
	PropertyCategoryModel,
	MCompanyModel,
	Permission,
	selectPropertyCategoryById,
	PropertyCategoryUpdated,
	selectAllPermissions,
	selectAllPropertyCategorys,

	selectLastCreatedPropertyCategoryId,
	PropertyCategoryOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-propertycategoryedit',
  templateUrl: './propertycategoryedit.component.html',
  styleUrls: ['./propertycategoryedit.component.scss']
})
export class PropertycategoryeditComponent implements OnInit {



	PropertyCategory: PropertyCategoryModel;
	PropertyCategory$: Observable<PropertyCategoryModel>;
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
	 * @param dialogRef: MatDialogRef<PropertyCategoryeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<PropertycategoryeditComponent>, private router: Router,
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

			this.PropertyCategory$ = this.store.pipe(select(selectPropertyCategoryById(this.data.id)));
		} else {

			const newPropertyCategory = new PropertyCategoryModel();
			newPropertyCategory.clear();
			this.PropertyCategory$ = of(newPropertyCategory);
		}
		this.PropertyCategory$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.PropertyCategory = new PropertyCategoryModel();
			this.PropertyCategory.id = res.id;
      this.PropertyCategory.propertycategory = res.propertycategory;	
      
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
	 * Returns PropertyCategory for save
	 */
	preparePropertyCategory(): PropertyCategoryModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _PropertyCategory = new PropertyCategoryModel();
	

		_PropertyCategory.id = this.PropertyCategory.id;
    _PropertyCategory.propertycategory = this.PropertyCategory.propertycategory;
    
		
		// _PropertyCategory.companyid = this.PropertyCategory.companyid;
		// _PropertyCategory.locationid = this.PropertyCategory.locationid;
		_PropertyCategory.cid = loginid;
		return _PropertyCategory;
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
		const editedPropertyCategory = this.preparePropertyCategory();
		if (editedPropertyCategory.id > 0) {
			this.updatePropertyCategory(editedPropertyCategory);
		} else {
			this.createPropertyCategory(editedPropertyCategory);
		}
	}

	/**
	 * Update PropertyCategory
	 *
	 * @param _PropertyCategory: PropertyCategory
	 */
	updatePropertyCategory(_PropertyCategory: PropertyCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updatePropertyCategory(_PropertyCategory).subscribe(data => {
			console.log('UpdatePropertyCategory Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_PropertyCategory,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create PropertyCategory
	 *
	 * @param _PropertyCategory: PropertyCategory
	 */
	createPropertyCategory(_PropertyCategory: PropertyCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createPropertyCategory(_PropertyCategory).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_PropertyCategory,
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


	
	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.PropertyCategory && this.PropertyCategory.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit PropertyCategory '${this.PropertyCategory.propertycategory}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New PropertyCategory';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.PropertyCategory && this.PropertyCategory.propertycategory.length > 0);
		// return (this.PropertyCategory && this.PropertyCategory.PropertyCategoryname && this.PropertyCategory.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}





