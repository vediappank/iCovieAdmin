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
	MStateModel,
	MCountryModel,
	MDepartmentModel,
	Permission,
	selectStateById,
	StateUpdated,
	selectAllPermissions,
	selectAllStates,
	MCompanyModel,
	selectLastCreatedStateId,
	StateOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
	selector: 'kt-stateedit',
	templateUrl: './stateedit.component.html',
	styleUrls: ['./stateedit.component.scss']
})
export class stateeditcomponent implements OnInit {


	allCountrys: MCountryModel[] = [];
	unassignedCountrys: MCountryModel[] = [];
	assignedCountrys: MCountryModel[] = [];
	CountryIdForAdding: any =0;
	CountrysSubject = new BehaviorSubject<number[]>([]);

	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);


	State: MStateModel;
	State$: Observable<MStateModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CountryID: any;
	StateID: any;
	isadmin: any;
	issuperadmin: any;
	CompanyID: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<stateeditcomponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<stateeditcomponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
			let getCompanyCountry = this.auth.getItems();
			this.CompanyID = getCompanyCountry[0].CompanyID;
			this.CountryID = getCompanyCountry[0].CountryID;
			console.log('Company Country One Time Configuration::: ' + JSON.stringify(getCompanyCountry));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.CountryID = JSON.parse(localStorage.getItem('currentUser')).Countryid;
			this.StateID = JSON.parse(localStorage.getItem('currentUser')).Stateid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.State$ = this.store.pipe(select(selectStateById(this.data.id)));
		} else {

			const newState = new MStateModel();
			newState.clear();
			this.State$ = of(newState);
		}

		this.State$.subscribe(res => {
			if (!res) {
				return;
			};

			this.State = new MStateModel();
			this.State.id = res.id;
			this.State.statename = res.statename;
			this.State.shortname = res.shortname;
			this.State.countryid = res.countryid;
			this.State.isCore = res.isCore;
			let v=[];
			v[0] =res.countryid; 
			v[1] =res.companyid; 
			this.CountrysSubject.next(v[0]);
			this.CountryIdForAdding = Number(v[0].toString());

			this.CompanysSubject.next(v[1]);
			this.CompanyIdForAdding = Number(v[1].toString());
		});

		this.auth.GetALLCountry().subscribe((Country: MCountryModel[]) => {
			each(Country, (_Country: MCountryModel) => {
				//if (_Country.id == this.CountryID) {
				this.allCountrys.push(_Country);
				this.unassignedCountrys.push(_Country);
				//}
			});
			if (this.issuperadmin == "False") {
				this.allCountrys = this.allCountrys.filter(row => row.id == this.CountryID)
				this.unassignedCountrys = this.unassignedCountrys.filter(row => row.id == this.CountryID);
			}
			each([Number(this.CountrysSubject.value.toString())], (roleId: number) => {
				const Country = find(this.allCountrys, (_Country: MCountryModel) => {
					return _Country.id === roleId;
				});
				if (Country) {
					this.assignedCountrys.push(Country);
					remove(this.unassignedCountrys, Country);
				}
			});
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
	 * Returns State for save
	 */
	prepareState(): MStateModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _State = new MStateModel();
		_State.id = this.State.id;
		if (this.CountryIdForAdding != undefined)
			_State.countryid = this.CountryIdForAdding;
		else
			_State.countryid = Number(this.CountrysSubject.value);
		_State.statename = this.State.statename;
		_State.shortname = this.State.shortname;
		if (this.CompanyIdForAdding != undefined)
		_State.companyid = this.CompanyIdForAdding;
	else
	_State.companyid = Number(this.CompanysSubject.value);
		_State.cid = loginid;
		return _State;
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
		const editedState = this.prepareState();
		if (editedState.id > 0) {
			this.updateState(editedState);
		} else {
			this.createState(editedState);
		}
	}

	/**
	 * Update State
	 *
	 * @param _State: State
	 */
	updateState(_State: MStateModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateState(_State).subscribe(data => {
			console.log('UpdateState Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_State,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create State
	 *
	 * @param _State: State
	 */
	createState(_State: MStateModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createState(_State).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_State,
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

	getCountryByCompany() {		
		if (this.allCountrys.length > 0) {
			this.unassignedCountrys = this.allCountrys.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.CountryIdForAdding = this.unassignedCountrys[0].id;
	}



	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.State && this.State.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit State '${this.State.statename}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New State';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.State && (this.CountryIdForAdding.length > 0 || this.State.countryid > 0 ) && this.State.statename.length > 0);
	}
}
