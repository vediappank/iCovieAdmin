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
	NeighbourhoodCategoryModel,
	MCompanyModel,
	Permission,
	selectNeighbourhoodCategoryById,
	NeighbourhoodCategoryUpdated,
	selectAllPermissions,
	selectAllNeighbourhoodCategorys,

	selectLastCreatedNeighbourhoodCategoryId,
	NeighbourhoodCategoryOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-neighbourhoodcategoryedit',
  templateUrl: './neighbourhoodcategoryedit.component.html',
  styleUrls: ['./neighbourhoodcategoryedit.component.scss']
})
export class NeighbourhoodcategoryeditComponent implements OnInit {


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

	NeighbourhoodCategory: NeighbourhoodCategoryModel;
	NeighbourhoodCategory$: Observable<NeighbourhoodCategoryModel>;
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
	 * @param dialogRef: MatDialogRef<NeighbourhoodCategoryeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<NeighbourhoodcategoryeditComponent>, private router: Router,
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

			this.NeighbourhoodCategory$ = this.store.pipe(select(selectNeighbourhoodCategoryById(this.data.id)));
		} else {

			const newNeighbourhoodCategory = new NeighbourhoodCategoryModel();
			newNeighbourhoodCategory.clear();
			this.NeighbourhoodCategory$ = of(newNeighbourhoodCategory);
		}
		this.NeighbourhoodCategory$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.NeighbourhoodCategory = new NeighbourhoodCategoryModel();
			this.NeighbourhoodCategory.id = res.id;
      this.NeighbourhoodCategory.neighbourhoodcategory = res.neighbourhoodcategory;	
      
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
	 * Returns NeighbourhoodCategory for save
	 */
	prepareNeighbourhoodCategory(): NeighbourhoodCategoryModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _NeighbourhoodCategory = new NeighbourhoodCategoryModel();
	

		_NeighbourhoodCategory.id = this.NeighbourhoodCategory.id;
    _NeighbourhoodCategory.neighbourhoodcategory = this.NeighbourhoodCategory.neighbourhoodcategory;
    
		
		// _NeighbourhoodCategory.companyid = this.NeighbourhoodCategory.companyid;
		// _NeighbourhoodCategory.locationid = this.NeighbourhoodCategory.locationid;
		_NeighbourhoodCategory.cid = loginid;
		return _NeighbourhoodCategory;
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
		const editedNeighbourhoodCategory = this.prepareNeighbourhoodCategory();
		if (editedNeighbourhoodCategory.id > 0) {
			this.updateNeighbourhoodCategory(editedNeighbourhoodCategory);
		} else {
			this.createNeighbourhoodCategory(editedNeighbourhoodCategory);
		}
	}

	/**
	 * Update NeighbourhoodCategory
	 *
	 * @param _NeighbourhoodCategory: NeighbourhoodCategory
	 */
	updateNeighbourhoodCategory(_NeighbourhoodCategory: NeighbourhoodCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateNeighbourhoodCategory(_NeighbourhoodCategory).subscribe(data => {
			console.log('UpdateNeighbourhoodCategory Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_NeighbourhoodCategory,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create NeighbourhoodCategory
	 *
	 * @param _NeighbourhoodCategory: NeighbourhoodCategory
	 */
	createNeighbourhoodCategory(_NeighbourhoodCategory: NeighbourhoodCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createNeighbourhoodCategory(_NeighbourhoodCategory).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_NeighbourhoodCategory,
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
		if (this.NeighbourhoodCategory && this.NeighbourhoodCategory.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Neighbourhood Category '${this.NeighbourhoodCategory.neighbourhoodcategory}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Neighbourhood Category';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.NeighbourhoodCategory && this.NeighbourhoodCategory.neighbourhoodcategory.length > 0);
		// return (this.NeighbourhoodCategory && this.NeighbourhoodCategory.NeighbourhoodCategoryname && this.NeighbourhoodCategory.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}



