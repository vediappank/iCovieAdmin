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
	MBuildingModel,
	MCompanyModel,
	Permission,
	selectBuildingById,
	BuildingUpdated,
	selectAllPermissions,
	selectAllBuildings,

	selectLastCreatedBuildingId,
	BuildingOnServerCreated,
	MLocationModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
	selector: 'kt-Buildingedit',
	templateUrl: './Buildingedit.component.html',
	styleUrls: ['./Buildingedit.component.scss']
})
export class BuildingeditComponent implements OnInit {


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

	Building: MBuildingModel;
	Building$: Observable<MBuildingModel>;
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
	 * @param dialogRef: MatDialogRef<BuildingeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<BuildingeditComponent>, private router: Router,
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

			this.Building$ = this.store.pipe(select(selectBuildingById(this.data.id)));
		} else {

			const newBuilding = new MBuildingModel();
			newBuilding.clear();
			this.Building$ = of(newBuilding);
		}
		this.Building$.subscribe(res => {
			if (!res) {
				return;
			}
			
			this.Building = new MBuildingModel();
			this.Building.id = res.id;
			this.Building.buildingname = res.buildingname;
			this.Building.shortname = res.shortname;
			this.Building.companyid = res.companyid;
			this.Building.locationid = res.locationid;
			this.Building.isCore = res.isCore;
			let x = []; 			
			x[0] = res.companyid;
			x[1] = res.locationid;
			this.CompanysSubject.next(x[0]);
			this.CompanyIdForAdding = Number(x[0].toString());

			this.LocationsSubject.next(x[1]);
			this.LocationIdForAdding = Number(x[1].toString());
		});


		this.auth.GetALLCompany().subscribe((users: MCompanyModel[]) => {
			each(users, (_Company: MCompanyModel) => {
				this.allCompanys.push(_Company);
				this.unassignedCompanys.push(_Company);
			});
			if(this.issuperadmin =="False")
				{
					this.allCompanys = this.allCompanys.filter(row=>row.id ==this.CompanyID)
					this.unassignedCompanys = this.unassignedCompanys.filter(row=>row.id ==this.CompanyID);
				}
			each([Number(this.CompanysSubject.value.toString())], (companyId: number) => {
				const Company = find(this.allCompanys, (_Company: MCompanyModel) => {
					return _Company.id === companyId;
				});
				if (Company) {
					this.assignedCompanys.push(Company);
					remove(this.unassignedCompanys, Company);
				}
			});
		});

		this.auth.GetALLLocation().subscribe((users: MLocationModel[]) => {
			each(users, (_Location: MLocationModel) => {
				this.allLocations.push(_Location);
				this.unassignedLocations.push(_Location);
			});
			each([Number(this.LocationsSubject.value.toString())], (locationId: number) => {
				const Location = find(this.allLocations, (_Location: MLocationModel) => {
					return _Location.id === locationId;
				});
				if (Location) {
					this.assignedLocations.push(Location);
					remove(this.unassignedLocations, Location);
				}
			});
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
	 * Returns Building for save
	 */
	prepareBuilding(): MBuildingModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}	
		const _Building = new MBuildingModel();
		if (this.CompanyIdForAdding != undefined)
			_Building.companyid = Number(this.CompanyIdForAdding);
		else
			_Building.companyid = Number(this.CompanysSubject.value);

		if (this.LocationIdForAdding != undefined)
			_Building.locationid = Number(this.LocationIdForAdding);
		else
			_Building.locationid = Number(this.LocationsSubject.value);

		_Building.id = this.Building.id;
		_Building.buildingname = this.Building.buildingname;
		_Building.shortname = this.Building.shortname;
		// _Building.companyid = this.Building.companyid;
		// _Building.locationid = this.Building.locationid;
		_Building.cuid = loginid;
		return _Building;
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
		const editedBuilding = this.prepareBuilding();
		if (editedBuilding.id > 0) {
			this.updateBuilding(editedBuilding);
		} else {
			this.createBuilding(editedBuilding);
		}
	}

	/**
	 * Update Building
	 *
	 * @param _Building: Building
	 */
	updateBuilding(_Building: MBuildingModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateBuilding(_Building).subscribe(data => {
			console.log('UpdateBuilding Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Building,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Building
	 *
	 * @param _Building: Building
	 */
	createBuilding(_Building: MBuildingModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createBuilding(_Building).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Building,
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
		if (this.Building && this.Building.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Building '${this.Building.buildingname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Building';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.Building && this.Building.buildingname && this.Building.shortname.length > 0);
		// return (this.Building && this.Building.Buildingname && this.Building.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}
