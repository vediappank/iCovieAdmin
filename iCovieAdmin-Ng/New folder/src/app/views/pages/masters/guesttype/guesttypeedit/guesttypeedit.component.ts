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
	GuestTypeModel,
	MCompanyModel,
	Permission,
	selectGuestTypeById,
	GuestTypeUpdated,
	selectAllPermissions,
	selectAllGuestTypes,

	selectLastCreatedGuestTypeId,
	GuestTypeOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-guesttypeedit',
  templateUrl: './guesttypeedit.component.html',
  styleUrls: ['./guesttypeedit.component.scss']
})
export class GuesttypeeditComponent implements OnInit {



	GuestType: GuestTypeModel;
	GuestType$: Observable<GuestTypeModel>;
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
	 * @param dialogRef: MatDialogRef<GuestTypeeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<GuesttypeeditComponent>, private router: Router,
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

			this.GuestType$ = this.store.pipe(select(selectGuestTypeById(this.data.id)));
		} else {

			const newGuestType = new GuestTypeModel();
			newGuestType.clear();
			this.GuestType$ = of(newGuestType);
		}
		this.GuestType$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.GuestType = new GuestTypeModel();
			this.GuestType.id = res.id;
      this.GuestType.guesttype = res.guesttype;	
      
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
	 * Returns GuestType for save
	 */
	prepareGuestType(): GuestTypeModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _GuestType = new GuestTypeModel();
	

		_GuestType.id = this.GuestType.id;
    _GuestType.guesttype = this.GuestType.guesttype;
    
		
		// _GuestType.companyid = this.GuestType.companyid;
		// _GuestType.locationid = this.GuestType.locationid;
		_GuestType.cid = loginid;
		return _GuestType;
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
		const editedGuestType = this.prepareGuestType();
		if (editedGuestType.id > 0) {
			this.updateGuestType(editedGuestType);
		} else {
			this.createGuestType(editedGuestType);
		}
	}

	/**
	 * Update GuestType
	 *
	 * @param _GuestType: GuestType
	 */
	updateGuestType(_GuestType: GuestTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateGuestType(_GuestType).subscribe(data => {
			console.log('UpdateGuestType Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_GuestType,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create GuestType
	 *
	 * @param _GuestType: GuestType
	 */
	createGuestType(_GuestType: GuestTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createGuestType(_GuestType).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_GuestType,
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
		if (this.GuestType && this.GuestType.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit GuestType '${this.GuestType.guesttype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New GuestType';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.GuestType && this.GuestType.guesttype.length > 0);
		// return (this.GuestType && this.GuestType.GuestTypename && this.GuestType.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}




