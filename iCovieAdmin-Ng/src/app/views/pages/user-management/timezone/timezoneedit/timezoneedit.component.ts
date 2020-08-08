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


// TimeZone
import { AppState } from '../../../../../core/reducers';

// Services and Models
import {
	MTimeZoneModel,
	MCountryModel,
	MDepartmentModel,
	Permission,
	selectTimeZoneById,
	TimeZoneUpdated,
	selectAllPermissions,
	selectAllTimeZones,

	selectLastCreatedTimeZoneId,
	TimeZoneOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
	selector: 'kt-timezoneedit',
	templateUrl: './timezoneedit.component.html',
	styleUrls: ['./timezoneedit.component.scss']
})
export class timezoneeditcomponent implements OnInit {


	allCountrys: MCountryModel[] = [];
	unassignedCountrys: MCountryModel[] = [];
	assignedCountrys: MCountryModel[] = [];
	CountryIdForAdding: number;
	CountrysSubject = new BehaviorSubject<number[]>([]);


	TimeZone: MTimeZoneModel;
	TimeZone$: Observable<MTimeZoneModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CountryID: any;
	TimeZoneID: any;
	isadmin: any;
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<TimeZoneeditComponent>
	 * @param data: any
	 * @param store: Store<AppTimeZone>
	 */
	constructor(public dialogRef: MatDialogRef<timezoneeditcomponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getCountryTimeZone = this.auth.getItems();
		this.CountryID = getCountryTimeZone[0].CountryID;
		this.TimeZoneID = getCountryTimeZone[0].TimeZoneID;
		console.log('Country TimeZone One Time Configuration::: ' + JSON.stringify(getCountryTimeZone));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.CountryID = JSON.parse(localStorage.getItem('currentUser')).Countryid;
			this.TimeZoneID = JSON.parse(localStorage.getItem('currentUser')).TimeZoneid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.TimeZone$ = this.store.pipe(select(selectTimeZoneById(this.data.id)));
		} else {

			const newTimeZone = new MTimeZoneModel();
			newTimeZone.clear();
			this.TimeZone$ = of(newTimeZone);
		}

		this.TimeZone$.subscribe(res => {
			if (!res) {
				return;
			};

			this.TimeZone = new MTimeZoneModel();
			this.TimeZone.id = res.id;
			this.TimeZone.timezone = res.timezone;
		//	this.TimeZone.shortname = res.shortname;			
			this.TimeZone.isCore = res.isCore;
			
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
	 * Returns TimeZone for save
	 */
	prepareTimeZone(): MTimeZoneModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _TimeZone = new MTimeZoneModel();
		_TimeZone.id = this.TimeZone.id;	
		_TimeZone.timezone = this.TimeZone.timezone;
		//_TimeZone.shortname = this.TimeZone.shortname;	
		_TimeZone.cid = loginid;
		return _TimeZone;
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
		const editedTimeZone = this.prepareTimeZone();
		if (editedTimeZone.id > 0) {
			this.updateTimeZone(editedTimeZone);
		} else {
			this.createTimeZone(editedTimeZone);
		}
	}

	/**
	 * Update TimeZone
	 *
	 * @param _TimeZone: TimeZone
	 */
	updateTimeZone(_TimeZone: MTimeZoneModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateTimeZone(_TimeZone).subscribe(data => {
			console.log('UpdateTimeZone Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_TimeZone,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create TimeZone
	 *
	 * @param _TimeZone: TimeZone
	 */
	createTimeZone(_TimeZone: MTimeZoneModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createTimeZone(_TimeZone).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_TimeZone,
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
		if (this.TimeZone && this.TimeZone.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit TimeZone '${this.TimeZone.timezone}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New TimeZone';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.TimeZone && this.TimeZone.timezone.length > 0);
	}
}
