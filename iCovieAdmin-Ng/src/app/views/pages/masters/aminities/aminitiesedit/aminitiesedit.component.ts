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
	AminitiesModel,
	MCompanyModel,
	Permission,
	selectAminitiesById,
	AminitiesUpdated,
	selectAllPermissions,
	selectAllAminitiess,

	selectLastCreatedAminitiesId,
	AminitiesOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
  selector: 'kt-aminitiesedit',
  templateUrl: './aminitiesedit.component.html',
  styleUrls: ['./aminitiesedit.component.scss']
})
export class AminitieseditComponent implements OnInit {


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

	Aminities: AminitiesModel;
	Aminities$: Observable<AminitiesModel>;
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
	 * @param dialogRef: MatDialogRef<AminitieseditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<AminitieseditComponent>, private router: Router,
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

			this.Aminities$ = this.store.pipe(select(selectAminitiesById(this.data.id)));
		} else {

			const newAminities = new AminitiesModel();
			newAminities.clear();
			this.Aminities$ = of(newAminities);
		}
		this.Aminities$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.Aminities = new AminitiesModel();
			this.Aminities.id = res.id;
			this.Aminities.aminities = res.aminities;	
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
	 * Returns Aminities for save
	 */
	prepareAminities(): AminitiesModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _Aminities = new AminitiesModel();
	

		_Aminities.id = this.Aminities.id;
		_Aminities.aminities = this.Aminities.aminities;
		
		// _Aminities.companyid = this.Aminities.companyid;
		// _Aminities.locationid = this.Aminities.locationid;
		_Aminities.cid = loginid;
		return _Aminities;
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
		const editedAminities = this.prepareAminities();
		if (editedAminities.id > 0) {
			this.updateAminities(editedAminities);
		} else {
			this.createAminities(editedAminities);
		}
	}

	/**
	 * Update Aminities
	 *
	 * @param _Aminities: Aminities
	 */
	updateAminities(_Aminities: AminitiesModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateAminities(_Aminities).subscribe(data => {
			console.log('Amenities Category Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Aminities,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Aminities
	 *
	 * @param _Aminities: Aminities
	 */
	createAminities(_Aminities: AminitiesModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createAminities(_Aminities).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Aminities,
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
		if (this.Aminities && this.Aminities.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Amenities Category '${this.Aminities.aminities}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Amenities Category';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.Aminities && this.Aminities.aminities.length > 0);
		// return (this.Aminities && this.Aminities.Aminitiesname && this.Aminities.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}

