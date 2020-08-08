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
	MWingModel,
	WingTypeModel,
	Permission,
	selectWingTypeById,
	WingTypeUpdated,
	selectAllPermissions,
	selectAllWingTypes,

	selectLastCreatedWingTypeId,
	WingTypeOnServerCreated,
	MCompanyModel,
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
	selector: 'kt-wingtypeedit',
	templateUrl: './wingtypeedit.component.html',
	styleUrls: ['./wingtypeedit.component.scss']
})
export class wingtypeeditcomponent implements OnInit {


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

	allWings: MWingModel[] = [];
	unassignedWings: MWingModel[] = [];
	assignedWings: MWingModel[] = [];
	WingIdForAdding: number;
	WingsSubject = new BehaviorSubject<number[]>([]);



	WingType: WingTypeModel;
	WingType$: Observable<WingTypeModel>;


	// Private properties
	private componentSubscriptions: Subscription;
	WingID: any;
	LocationID: any;
	selectedWing: string;
	selectedLocation: string;
	public defaultLocations = [];
	public filterLocations = [];
	companyid: number;
	locationid: number;

	public defaultWings = [];
	public AdmindefaultWings = [];
	isadmin: any;

	issuperadmin: any;
	CompanyID: number;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<wingtypeeditcomponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<wingtypeeditcomponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getWingLocation = this.auth.getItems();
		this.WingID = getWingLocation[0].WingID;
		this.LocationID = getWingLocation[0].LocationID;
		console.log('Wing Location One Time Configuration::: ' + JSON.stringify(getWingLocation));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.WingID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.WingType$ = this.store.pipe(select(selectWingTypeById(this.data.id)));
		} else {

			const newWingType = new WingTypeModel();
			newWingType.clear();
			this.WingType$ = of(newWingType);
		}
		this.WingType$.subscribe(res => {
			if (!res) {
				return;
			}

			this.WingType = new WingTypeModel();
			this.WingType.id = res.id;
			this.WingType.unitsid = res.unitsid;
			this.WingType.unitstype = res.unitstype;
			
			if (res.unitsid > 0) {
				let x = [];

				x[0] = res.companyid;
				x[1] = res.locationid;
				x[2] = res.buildingid;
				x[3] = res.floorid;
				x[4] = res.unitsid;
				this.CompanysSubject.next(x[0]);
				this.CompanyIdForAdding = Number(x[0].toString());

				this.LocationsSubject.next(x[1]);
				this.LocationIdForAdding = Number(x[1].toString());

				this.BuildingsSubject.next(x[2]);
				this.BuildingIdForAdding = Number(x[2].toString());

				this.FloorsSubject.next(x[3]);
				this.FloorIdForAdding = Number(x[3].toString());

				this.WingsSubject.next(x[4]);
				this.WingIdForAdding = Number(x[4].toString());
			}
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

		this.auth.GetALLWing().subscribe((users: MWingModel[]) => {
			each(users, (_Wing: MWingModel) => {
				this.allWings.push(_Wing);
				this.unassignedWings.push(_Wing);
			});
			if (this.issuperadmin == "False") {
				this.allWings = this.allWings.filter(row => row.id == this.WingID)
				this.unassignedWings = this.unassignedWings.filter(row => row.id == this.WingID);
			}
			each([Number(this.WingsSubject.value.toString())], (WingId: number) => {
				const Wing = find(this.allWings, (_Wing: MWingModel) => {
					return _Wing.id === WingId;
				});
				
				if (Wing) {
					debugger
					this.assignedWings.push(Wing);
					remove(this.unassignedWings, Wing);
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
	 * Returns WingType for save
	 */
	prepareWingType(): WingTypeModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}
		const _WingType = new WingTypeModel();
		if (this.WingIdForAdding != undefined)
			_WingType.unitsid = Number(this.WingIdForAdding);
		else
			_WingType.unitsid = Number(this.WingsSubject.value);

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



		_WingType.id = this.WingType.id;
		_WingType.unitstype = this.WingType.unitstype;
		//_WingType.wingimages = this.WingType.wingimages;

		_WingType.cid = loginid;
		return _WingType;
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
		const editedWingType = this.prepareWingType();
		if (editedWingType.id > 0) {
			this.updateWingType(editedWingType);
		} else {
			this.createWingType(editedWingType);
		}
	}

	/**
	 * Update WingType
	 *
	 * @param _WingType: WingType
	 */
	updateWingType(_WingType: WingTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateWingType(_WingType).subscribe(data => {
			console.log('UpdateWingType Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_WingType,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create WingType
	 *
	 * @param _WingType: WingType
	 */
	createWingType(_WingType: WingTypeModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createWingType(_WingType).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_WingType,
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
		if (this.WingType && this.WingType.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Units Type '${this.WingType.unitstype}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Units Type';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.WingType && this.WingType.unitstype.length > 0);
		// return (this.WingType && this.WingType.WingTypename && this.WingType.shortname.length > 0 && this.WingtypeIdForAdding != undefined);
	}
}

