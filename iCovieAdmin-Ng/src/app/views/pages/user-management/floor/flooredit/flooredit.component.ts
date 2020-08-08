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
	MFloorModel,
	MCompanyModel,
	Permission,
	selectFloorById,
	FloorUpdated,
	selectAllPermissions,
	selectAllFloors,

	selectLastCreatedFloorId,
	FloorOnServerCreated,
	MLocationModel,
	MBuildingModel, PropertyFloorCheckBoxesModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';
import { debug } from 'console';

@Component({
	selector: 'kt-Flooredit',
	templateUrl: './Flooredit.component.html',
	styleUrls: ['./Flooredit.component.scss']
})
export class FlooreditComponent implements OnInit {

	selectedPropertyFloor: PropertyFloorCheckBoxesModel;
	selectedPropertyFloorList: PropertyFloorCheckBoxesModel[] = [];
	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);


	FloorCollection: PropertyFloorCheckBoxesModel[] = [];
	allLocations: MLocationModel[] = [];
	unassignedLocations: MLocationModel[] = [];
	assignedLocations: MLocationModel[] = [];
	LocationIdForAdding: number;
	LocationsSubject = new BehaviorSubject<number[]>([]);

	allBuildings: MBuildingModel[] = [];
	unassignedBuildings: MBuildingModel[] = [];
	assignedBuildings: MBuildingModel[] = [];
	assignedBuildingsForFloor: MBuildingModel[] = [];
	BuildingIdForAdding: number;
	BuildingNameForAdding: string;
	BuildingsSubject = new BehaviorSubject<number[]>([]);

	Floor: MFloorModel;
	Floor$: Observable<MFloorModel>;
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

	issuperadmin: string;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<FlooreditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<FlooreditComponent>, private router: Router,
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

			this.Floor$ = this.store.pipe(select(selectFloorById(this.data.id)));
		} else {

			const newFloor = new MFloorModel();
			newFloor.clear();
			this.Floor$ = of(newFloor);
		}


		this.Floor$.subscribe(res => {
			if (!res) {
				return;
			}

			this.Floor = new MFloorModel();
			this.Floor.id = res.id;
			this.Floor.floorname = res.floorname;
			this.Floor.shortname = res.shortname;
			this.Floor.companyid = res.companyid;
			this.Floor.locationid = res.locationid;
			this.Floor.isCore = res.isCore;
			let x = [];
			x[0] = res.companyid;
			x[1] = res.locationid;
			x[2] = res.buildingid;
			this.CompanysSubject.next(x[0]);
			this.CompanyIdForAdding = Number(x[0].toString());

			this.LocationsSubject.next(x[1]);
			this.LocationIdForAdding = Number(x[1].toString());

			this.BuildingsSubject.next(x[2]);
			this.BuildingIdForAdding = Number(x[2].toString());

			if (res.floorcheckedlist.length > 0) {
				for (let i = 0; i < res.floorcheckedlist.length; i++) {
					this.selectedPropertyFloor = {
						id: res.floorcheckedlist[i].id, name: res.floorcheckedlist[i].name
					}
					this.selectedPropertyFloorList.push(this.selectedPropertyFloor);
				}
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
			this.getAllFloorCollectionEdit(this.BuildingIdForAdding);
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
	 * Returns Floor for save
	 */
	prepareFloor(): MFloorModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Floor = new MFloorModel();
		if (this.CompanyIdForAdding != undefined)
			_Floor.companyid = Number(this.CompanyIdForAdding);
		else
			_Floor.companyid = Number(this.CompanysSubject.value);

		if (this.LocationIdForAdding != undefined)
			_Floor.locationid = Number(this.LocationIdForAdding);
		else
			_Floor.locationid = Number(this.LocationsSubject.value);

		if (this.LocationIdForAdding != undefined)
			_Floor.buildingid = Number(this.BuildingIdForAdding);
		else
			_Floor.buildingid = Number(this.BuildingsSubject.value);


		_Floor.id = this.Floor.id;
		_Floor.floorname = this.Floor.floorname;
		_Floor.shortname = this.Floor.shortname;
		_Floor.floorcheckedlist = this.selectedPropertyFloorList;
		_Floor.cid = loginid;
		return _Floor;
	}

	getAllFloorCollectionEdit(propertyid) {
		debugger;
	
		let properties: [] = [];
		if (this.allBuildings.length > 0) {
			this.assignedBuildingsForFloor = this.allBuildings.filter(row => row.id == propertyid);
		}
		this.BuildingNameForAdding = this.assignedBuildingsForFloor[0].shortname;
		this.FloorCollection = [];
		for (let i = 1; i <= 10; i++) {
			this.FloorCollection.push({ id: propertyid, name: this.BuildingNameForAdding + "-" + "Floor" + "-" + i });
		}
	}


	getAllFloorCollection(propertyid) {
		debugger;
	
		let properties: [] = [];
		if (this.allBuildings.length > 0) {
			this.assignedBuildingsForFloor = this.allBuildings.filter(row => row.id == propertyid.value);
		}
		this.BuildingNameForAdding = this.assignedBuildingsForFloor[0].shortname;
		this.selectedPropertyFloorList=[];
		this.FloorCollection = [];
		for (let i = 1; i <= 10; i++) {
			this.FloorCollection.push({ id: propertyid.value, name: this.BuildingNameForAdding + "-" + "Floor" + "-" + i });
		}
	}
	onFloorChange(event, Selectdata: PropertyFloorCheckBoxesModel) {

		debugger;

		if (event.checked) {
			this.selectedPropertyFloor = {
				id: Selectdata.id, name: Selectdata.name
			}
			this.selectedPropertyFloorList.push(this.selectedPropertyFloor);
		} else {
			this.selectedPropertyFloor = {
				id: Selectdata.id, name: Selectdata.name
			}
			const index = this.selectedPropertyFloorList.findIndex(x => x.id === Selectdata.id && x.name === Selectdata.name);
			//let index = this.selectedAminitsTypeList.indexOf(this.selectedAminitsType);
			this.selectedPropertyFloorList.splice(index, 1);
		}
		console.log('Selected Neighbourcategory Collection:::' + JSON.stringify(this.selectedPropertyFloorList));
	}

	isFloorchecked: any[] = [];
	VaildateFloor(id): boolean {
		this.isFloorchecked = this.selectedPropertyFloorList.filter(row => row.name == id);

		if (this.isFloorchecked.length > 0) {
			return true;
		}
		else
			return false;
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
		debugger;
		const editedFloor = this.prepareFloor();
		if (editedFloor.id > 0) {
			this.updateFloor(editedFloor);
		} else {
			this.createFloor(editedFloor);
		}
	}

	/**
	 * Update Floor
	 *
	 * @param _Floor: Floor
	 */
	updateFloor(_Floor: MFloorModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		;
		this.auth.updateFloor(_Floor).subscribe(data => {
			console.log('UpdateFloor Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Floor,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Floor
	 *
	 * @param _Floor: Floor
	 */
	createFloor(_Floor: MFloorModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		
		this.auth.createFloor(_Floor).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Floor,
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
		debugger;
		if (this.allBuildings.length > 0) {
			this.unassignedBuildings = this.allBuildings.filter(row => row.locationid == Number(this.LocationIdForAdding));
		}
		this.BuildingIdForAdding = this.unassignedBuildings[0].id;
		this.BuildingNameForAdding = this.unassignedBuildings[0].shortname;
	}


	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.Floor && this.Floor.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Floor '${this.Floor.floorname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Floor';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.selectedPropertyFloorList.length > 0);
		// return (this.Floor && this.Floor.Floorname && this.Floor.shortname.length > 0 && this.CompanyIdForAdding != undefined);
	}
}
