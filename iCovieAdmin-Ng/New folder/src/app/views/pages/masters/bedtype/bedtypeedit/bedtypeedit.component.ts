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
	BedTypeModel,
	MCompanyModel,
	Permission,
	selectBedTypeById,
	BedTypeUpdated,
	selectAllPermissions,
	selectAllBedTypes,

	selectLastCreatedBedTypeId,
	BedTypeOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-bedtypeedit',
  templateUrl: './bedtypeedit.component.html',
  styleUrls: ['./bedtypeedit.component.scss']
})
export class BedtypeeditComponent implements OnInit {


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

	BedType: BedTypeModel;
	BedType$: Observable<BedTypeModel>;
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
	 * @param dialogRef: MatDialogRef<BedTypeeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<BedtypeeditComponent>, private router: Router,
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

			this.BedType$ = this.store.pipe(select(selectBedTypeById(this.data.id)));
		} else {

			const newBedType = new BedTypeModel();
			newBedType.clear();
			this.BedType$ = of(newBedType);
		}
		this.BedType$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.BedType = new BedTypeModel();
			this.BedType.id = res.id;
      this.BedType.bedtype = res.bedtype;	
      
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
	 * Returns BedType for save
	 */
	prepareBedType(): BedTypeModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _BedType = new BedTypeModel();
	

		_BedType.id = this.BedType.id;
    _BedType.bedtype = this.BedType.bedtype;
    
		
		// _BedType.companyid = this.BedType.companyid;
		// _BedType.locationid = this.BedType.locationid;
		_BedType.cid = loginid;
		return _BedType;
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
		const editedBedType = this.prepareBedType();
		if (editedBedType.id > 0) {
			this.updateBedType(editedBedType);
		} else {
			this.createBedType(editedBedType);
		}
	}

	/**
	 * Update BedType
	 *
	 * @param _BedType: BedType
	 */
	updateBedType(_BedType: BedTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateBedType(_BedType).subscribe(data => {
			console.log('UpdateBedType Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_BedType,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create BedType
	 *
	 * @param _BedType: BedType
	 */
	createBedType(_BedType: BedTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createBedType(_BedType).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_BedType,
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
		if (this.BedType && this.BedType.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit BedType '${this.BedType.bedtype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New BedType';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.BedType && this.BedType.bedtype.length > 0);
		// return (this.BedType && this.BedType.BedTypename && this.BedType.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}


