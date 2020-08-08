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
	MRegionModel,
	MCountryModel,
	MDepartmentModel,
	Permission,
	selectRegionById,
	RegionUpdated,
	selectAllPermissions,
	selectAllRegions,

	selectLastCreatedRegionId,
	RegionOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
	selector: 'kt-regionedit',
	templateUrl: './regionedit.component.html',
	styleUrls: ['./regionedit.component.scss']
})
export class regioneditcomponent implements OnInit {
	allCountrys: MCountryModel[] = [];
	filteredCountrys: MCountryModel[] = [];
	assignedCountrys: MCountryModel[] = [];
	CountryIdForAdding: number;
	CountrysSubject = new BehaviorSubject<number[]>([]);


	Region: MRegionModel;
	Region$: Observable<MRegionModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CountryID: any;
	RegionID: any;
	isadmin: any;
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RegioneditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<regioneditcomponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getCountryRegion = this.auth.getItems();
		this.CountryID = getCountryRegion[0].CountryID;
		this.RegionID = getCountryRegion[0].RegionID;
		console.log('Country Region One Time Configuration::: ' + JSON.stringify(getCountryRegion));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.CountryID = JSON.parse(localStorage.getItem('currentUser')).Countryid;
			this.RegionID = JSON.parse(localStorage.getItem('currentUser')).Regionid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.Region$ = this.store.pipe(select(selectRegionById(this.data.id)));
		} else {

			const newRegion = new MRegionModel();
			newRegion.clear();
			this.Region$ = of(newRegion);
		}

		this.Region$.subscribe(res => {
			if (!res) {
				return;
			};

			this.Region = new MRegionModel();
			this.Region.id = res.id;
			this.Region.regionname = res.regionname;
			this.Region.shortname = res.shortname;
			this.Region.countryid = res.countryid;
			this.Region.isCore = res.isCore;
		
			this.CountryIdForAdding = Number(res.countryid);
		});
		this.auth.GetALLCountry().subscribe((_Country: MCountryModel[]) => {
				
				this.allCountrys= _Country;
				this.filteredCountrys =this.allCountrys;			
		
			if (this.issuperadmin == "False") {
				
				this.filteredCountrys = this.allCountrys.filter(row => row.id == this.CountryID);
			}

			
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
	 * Returns Region for save
	 */
	prepareRegion(): MRegionModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Region = new MRegionModel();
		_Region.id = this.Region.id;
	
			_Region.countryid = this.CountryIdForAdding;
	
		_Region.regionname = this.Region.regionname;
		_Region.shortname = this.Region.shortname;
		//_Region.Countryid = this.CountryID;
		_Region.cid = loginid;
		return _Region;
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
		const editedRegion = this.prepareRegion();
		if (editedRegion.id > 0) {
			this.updateRegion(editedRegion);
		} else {
			this.createRegion(editedRegion);
		}
	}

	/**
	 * Update Region
	 *
	 * @param _Region: Region
	 */
	updateRegion(_Region: MRegionModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateRegion(_Region).subscribe(data => {
			console.log('UpdateRegion Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Region,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Region
	 *
	 * @param _Region: Region
	 */
	createRegion(_Region: MRegionModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createRegion(_Region).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Region,
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
		if (this.Region && this.Region.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Region '${this.Region.regionname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Region';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.Region && (this.CountryIdForAdding > 0 || this.Region.countryid > 0) && this.Region.regionname.length > 0);
	}
}
