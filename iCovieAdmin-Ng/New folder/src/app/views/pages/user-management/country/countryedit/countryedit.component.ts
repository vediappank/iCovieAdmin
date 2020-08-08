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
	MCountryModel,
	MCompanyModel,
	MDepartmentModel,
	Permission,
	selectCountryById,
	CountryUpdated,
	selectAllPermissions,
	selectAllCountrys,

	selectLastCreatedCountryId,
	CountryOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
	selector: 'kt-countryedit',
	templateUrl: './countryedit.component.html',
	styleUrls: ['./countryedit.component.scss']
})
export class countryeditcomponent implements OnInit {


	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);


	Country: MCountryModel;
	Country$: Observable<MCountryModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CompanyID: any;
	CountryID: any;
	isadmin: any;
	issuperadmin: any;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CountryeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<countryeditcomponent>,
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
			this.CompanyID = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.CountryID = JSON.parse(localStorage.getItem('currentUser')).Countryid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.Country$ = this.store.pipe(select(selectCountryById(this.data.id)));
		} else {

			const newCountry = new MCountryModel();
			newCountry.clear();
			this.Country$ = of(newCountry);
		}

		this.Country$.subscribe(res => {
			if (!res) {
				return;
			};

			this.Country = new MCountryModel();
			this.Country.id = res.id;
			this.Country.countryname = res.countryname;
			this.Country.shortname = res.shortname;
			this.Country.companyid = res.companyid;
			this.Country.isCore = res.isCore;
			let x = []; 			
			x[0] = res.companyid;
			
			this.CompanysSubject.next(x[0]);
			this.CompanyIdForAdding = Number(x[0].toString());
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
	 * Returns Country for save
	 */
	prepareCountry(): MCountryModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}

		const _Country = new MCountryModel();
		_Country.id = this.Country.id;
		if (this.CompanyIdForAdding != undefined)
			_Country.companyid = this.CompanyIdForAdding;
		else
			_Country.companyid = Number(this.CompanysSubject.value);
		_Country.countryname = this.Country.countryname;
		_Country.shortname = this.Country.shortname;
		//_Country.companyid = this.CompanyID;
		_Country.cid = loginid;
		return _Country;
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
		const editedCountry = this.prepareCountry();
		if (editedCountry.id > 0) {
			this.updateCountry(editedCountry);
		} else {
			this.createCountry(editedCountry);
		}
	}

	/**
	 * Update Country
	 *
	 * @param _Country: Country
	 */
	updateCountry(_Country: MCountryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCountry(_Country).subscribe(data => {
			console.log('UpdateCountry Data received: ' + data)

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Country,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Country
	 *
	 * @param _Country: Country
	 */
	createCountry(_Country: MCountryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCountry(_Country).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Country,
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
		if (this.Country && this.Country.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Country '${this.Country.countryname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Country';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.Country && this.Country.countryname && this.Country.shortname.length > 0);
	}
}
