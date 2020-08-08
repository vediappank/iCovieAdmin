// Angular
import {
	Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy,
	ViewChild, ɵbypassSanitizationTrustResourceUrl, Injectable, EventEmitter
} from '@angular/core';
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
	MWingModel,
	MCompanyModel,
	Permission,
	selectWingById,
	WingUpdated,
	selectAllPermissions,
	selectAllWings,

	selectLastCreatedWingId,
	WingOnServerCreated,
	MLocationModel,
	MBuildingModel,
	MFloorModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
	selector: 'kt-Wingedit',
	templateUrl: './Wingedit.component.html',
	styleUrls: ['./Wingedit.component.scss']
})

export class WingeditComponent implements OnInit {

	public adminmenucontrol: Boolean = false;
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

	allBuildings: MBuildingModel[] = [];
	unassignedBuildings: MBuildingModel[] = [];
	assignedBuildings: MBuildingModel[] = [];
	BuildingIdForAdding: number;
	BuildingsSubject = new BehaviorSubject<number[]>([]);

	allFloors: MFloorModel[] = [];
	unassignedFloors: MFloorModel[] = [];
	assignedFloors: MFloorModel[] = [];
	FloorIdForAdding: number;
	FloorsSubject = new BehaviorSubject<number[]>([]);

	Wing: MWingModel;
	Wing$: Observable<MWingModel>;
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
	 * @param dialogRef: MatDialogRef<WingeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<WingeditComponent>, private router: Router,
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
			this.Wing$ = this.store.pipe(select(selectWingById(this.data.id)));
		} else {
			const newWing = new MWingModel();
			newWing.clear();
			this.Wing$ = of(newWing);
		}
		this.Wing$.subscribe(res => {
			if (!res) {
				return;
			}

			this.Wing = new MWingModel();
			this.Wing.id = res.id;
			this.Wing.unitsname = res.unitsname;
			this.Wing.shortname = res.shortname;
			this.Wing.companyid = res.companyid;
			this.Wing.locationid = res.locationid;
			this.Wing.isCore = res.isCore;
			let x = []; 			
			x[0] = res.companyid;
			x[1] = res.locationid;
			x[2] = res.buildingid;
			x[3] = res.floorid;
			this.CompanysSubject.next(x[0]);
			this.CompanyIdForAdding = Number(x[0].toString());

			this.LocationsSubject.next(x[1]);
			this.LocationIdForAdding = Number(x[1].toString());

			this.BuildingsSubject.next(x[2]);
			this.BuildingIdForAdding = Number(x[2].toString());

			this.FloorsSubject.next(x[3]);
			this.FloorIdForAdding = Number(x[3].toString());

		});


		this.auth.GetALLCompany().subscribe((users: MCompanyModel[]) => {
			each(users, (_Company: MCompanyModel) => {
				// if (_Company.id == this.CompanyID) {
				this.allCompanys.push(_Company);
				this.unassignedCompanys.push(_Company);
				// }
			});
			if (this.issuperadmin == "False") {
				this.allCompanys = this.allCompanys.filter(row => row.id == this.CompanyID)
				this.unassignedCompanys = this.unassignedCompanys.filter(row => row.id == this.CompanyID);
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
				// if (_Location.id == this.LocationID) {
				this.allLocations.push(_Location);
				this.unassignedLocations.push(_Location);
				// }
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

		this.auth.GetALLBuilding().subscribe((users: MBuildingModel[]) => {
			each(users, (_Building: MBuildingModel) => {
				// if (_Building.id == this.BuildingID) {

				this.allBuildings.push(_Building);
				this.unassignedBuildings.push(_Building);
				// }
			});
			each([Number(this.BuildingsSubject.value.toString())], (BuildingId: number) => {
				const Building = find(this.allBuildings, (_Building: MBuildingModel) => {

					return _Building.id === BuildingId;
				});
				if (Building) {
					this.assignedBuildings.push(Building);
					remove(this.unassignedBuildings, Building);
				}
			});
		});


		this.auth.GetALLFloor().subscribe((users: MFloorModel[]) => {
			each(users, (_Floor: MFloorModel) => {
				// if (_Floor.id == this.FloorID) {

				this.allFloors.push(_Floor);
				this.unassignedFloors.push(_Floor);
				// }
			});
			each([Number(this.FloorsSubject.value.toString())], (FloorId: number) => {
				const Floor = find(this.allFloors, (_Floor: MFloorModel) => {

					return _Floor.id === FloorId;
				});
				if (Floor) {
					this.assignedFloors.push(Floor);
					remove(this.unassignedFloors, Floor);
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
	 * Returns Wing for save
	 */
	prepareWing(): MWingModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Wing = new MWingModel();
		if (this.CompanyIdForAdding != undefined)
			_Wing.companyid = Number(this.CompanyIdForAdding);
		else
			_Wing.companyid = Number(this.CompanysSubject.value);

		if (this.LocationIdForAdding != undefined)
			_Wing.locationid = Number(this.LocationIdForAdding);
		else
			_Wing.locationid = Number(this.LocationsSubject.value);

		if (this.BuildingIdForAdding != undefined)
			_Wing.buildingid = Number(this.BuildingIdForAdding);
		else
			_Wing.buildingid = Number(this.BuildingsSubject.value);

		if (this.FloorIdForAdding != undefined)
			_Wing.floorid = Number(this.FloorIdForAdding);
		else
			_Wing.floorid = Number(this.FloorsSubject.value);

		_Wing.id = this.Wing.id;
		_Wing.unitsname = this.Wing.unitsname;
		_Wing.shortname = this.Wing.shortname;
		// _Wing.companyid = this.Wing.companyid;
		// _Wing.locationid = this.Wing.locationid;
		_Wing.cuid = loginid;
		return _Wing;
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
		const editedWing = this.prepareWing();
		if (editedWing.id > 0) {
			this.updateWing(editedWing);
		} else {
			this.createWing(editedWing);
		}
	}

	/**
	 * Update Wing
	 *
	 * @param _Wing: Wing
	 */
	updateWing(_Wing: MWingModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		;
		this.auth.updateWing(_Wing).subscribe(data => {
			console.log('UpdateWing Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Wing,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Wing
	 *
	 * @param _Wing: Wing
	 */
	createWing(_Wing: MWingModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
	
		this.auth.createWing(_Wing).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Wing,
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

	getBuildingByLocation() {
		if (this.allBuildings.length > 0) {
			this.unassignedBuildings = this.allBuildings.filter(row => row.locationid == Number(this.LocationIdForAdding));
		}
		this.BuildingIdForAdding = this.unassignedBuildings[0].id;
	}

	getFloorByBuilding() {
		if (this.allFloors.length > 0) {
			this.unassignedFloors = this.allFloors.filter(row => row.buildingid == Number(this.BuildingIdForAdding));
		}
		this.FloorIdForAdding = this.unassignedFloors[0].id;
	}



	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.Wing && this.Wing.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Units '${this.Wing.unitsname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Units';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.Wing && this.Wing.unitsname && this.Wing.shortname.length > 0);
		// return (this.Wing && this.Wing.Wingname && this.Wing.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}
