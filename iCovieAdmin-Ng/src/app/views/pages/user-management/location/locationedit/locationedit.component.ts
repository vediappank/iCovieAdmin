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


// State
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {
	MLocationModel,
	MCompanyModel,
	MDepartmentModel,
	Permission,
	selectLocationById,
	LocationUpdated,
	selectAllPermissions,
	selectAllLocations,

	selectLastCreatedLocationId,
	LocationOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
	selector: 'kt-Locationedit',
	templateUrl: './Locationedit.component.html',
	styleUrls: ['./Locationedit.component.scss']
})
export class LocationeditComponent implements OnInit {


	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);


	Location: MLocationModel;
	Location$: Observable<MLocationModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CompanyID: any;
	LocationID: any;
	isadmin: any;
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<LocationeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<LocationeditComponent>,
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

			this.Location$ = this.store.pipe(select(selectLocationById(this.data.id)));
		} else {

			const newLocation = new MLocationModel();
			newLocation.clear();
			this.Location$ = of(newLocation);
		}

		this.Location$.subscribe(res => {
			if (!res) {
				return;
			};

			this.Location = new MLocationModel();
			this.Location.id = res.id;
			this.Location.locationname = res.locationname;
			this.Location.shortname = res.shortname;
			this.Location.companyid = res.companyid;
			this.Location.isCore = res.isCore;
			this.CompanysSubject.next(res.companyids);
			this.CompanyIdForAdding = Number(res.companyids.toString());
		});
		this.auth.GetALLCompany().subscribe((company: MCompanyModel[]) => {
			each(company, (_company: MCompanyModel) => {
				//if (_company.id == this.CompanyID) {
				this.allCompanys.push(_company);
				this.unassignedCompanys.push(_company);
				//}
			});
			if (this.issuperadmin == "False") {
				this.allCompanys = this.allCompanys.filter(row => row.id == this.CompanyID)
				this.unassignedCompanys = this.unassignedCompanys.filter(row => row.id == this.CompanyID);
			}
			each([Number(this.CompanysSubject.value.toString())], (roleId: number) => {
				const Company = find(this.allCompanys, (_Company: MCompanyModel) => {
					return _Company.id === roleId;
				});
				if (Company) {
					this.assignedCompanys.push(Company);
					remove(this.unassignedCompanys, Company);
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
	 * Returns Location for save
	 */
	prepareLocation(): MLocationModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Location = new MLocationModel();
		_Location.id = this.Location.id;
		if (this.CompanyIdForAdding != undefined)
			_Location.companyid = this.CompanyIdForAdding;
		else
			_Location.companyid = Number(this.CompanysSubject.value);
		_Location.locationname = this.Location.locationname;
		_Location.shortname = this.Location.shortname;
		//_Location.companyid = this.CompanyID;
		_Location.cuid = loginid;
		return _Location;
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
		const editedLocation = this.prepareLocation();
		if (editedLocation.id > 0) {
			this.updateLocation(editedLocation);
		} else {
			this.createLocation(editedLocation);
		}
	}

	/**
	 * Update Location
	 *
	 * @param _Location: Location
	 */
	updateLocation(_Location: MLocationModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateLocation(_Location).subscribe(data => {
			console.log('UpdateLocation Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Location,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Location
	 *
	 * @param _Location: Location
	 */
	createLocation(_Location: MLocationModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createLocation(_Location).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Location,
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



	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.Location && this.Location.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Location '${this.Location.locationname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Location';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.Location && this.Location.locationname && this.Location.shortname.length > 0);
	}
}
