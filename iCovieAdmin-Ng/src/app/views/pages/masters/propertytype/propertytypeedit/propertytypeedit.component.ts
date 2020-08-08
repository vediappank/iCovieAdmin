
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
	PropertyTypeModel,
	MCompanyModel,
	Permission,
	selectPropertyTypeById,
	PropertyTypeUpdated,
	selectAllPermissions,
	selectAllPropertyTypes,

	selectLastCreatedPropertyTypeId,
	PropertyTypeOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-propertytypeedit',
  templateUrl: './propertytypeedit.component.html',
  styleUrls: ['./propertytypeedit.component.scss']
})
export class PropertytypeeditComponent implements OnInit {



	PropertyType: PropertyTypeModel;
	PropertyType$: Observable<PropertyTypeModel>;
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
	 * @param dialogRef: MatDialogRef<PropertyTypeeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<PropertytypeeditComponent>, private router: Router,
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

			this.PropertyType$ = this.store.pipe(select(selectPropertyTypeById(this.data.id)));
		} else {

			const newPropertyType = new PropertyTypeModel();
			newPropertyType.clear();
			this.PropertyType$ = of(newPropertyType);
		}
		this.PropertyType$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.PropertyType = new PropertyTypeModel();
			this.PropertyType.id = res.id;
      this.PropertyType.propertytype = res.propertytype;	
      
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
	 * Returns PropertyType for save
	 */
	preparePropertyType(): PropertyTypeModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _PropertyType = new PropertyTypeModel();
	

		_PropertyType.id = this.PropertyType.id;
    _PropertyType.propertytype = this.PropertyType.propertytype;
    
		
		// _PropertyType.companyid = this.PropertyType.companyid;
		// _PropertyType.locationid = this.PropertyType.locationid;
		_PropertyType.cid = loginid;
		return _PropertyType;
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
		const editedPropertyType = this.preparePropertyType();
		if (editedPropertyType.id > 0) {
			this.updatePropertyType(editedPropertyType);
		} else {
			this.createPropertyType(editedPropertyType);
		}
	}

	/**
	 * Update PropertyType
	 *
	 * @param _PropertyType: PropertyType
	 */
	updatePropertyType(_PropertyType: PropertyTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updatePropertyType(_PropertyType).subscribe(data => {
			console.log('UpdatePropertyType Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_PropertyType,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create PropertyType
	 *
	 * @param _PropertyType: PropertyType
	 */
	createPropertyType(_PropertyType: PropertyTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createPropertyType(_PropertyType).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_PropertyType,
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
		if (this.PropertyType && this.PropertyType.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit PropertyType '${this.PropertyType.propertytype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New PropertyType';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.PropertyType && this.PropertyType.propertytype.length > 0);
		// return (this.PropertyType && this.PropertyType.PropertyTypename && this.PropertyType.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}





