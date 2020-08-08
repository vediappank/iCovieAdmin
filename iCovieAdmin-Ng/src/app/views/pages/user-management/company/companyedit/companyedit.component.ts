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
	MCompanyModel,
	MCityModel,
	Permission,
	selectCompanyById,
	CompanyUpdated,
	selectAllPermissions,
	selectAllCompanys,

	selectLastCreatedCompanyId,
	CompanyOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';

@Component({
  selector: 'kt-Companyedit',
  templateUrl: './Companyedit.component.html',
  styleUrls: ['./Companyedit.component.scss']
})
export class CompanyeditComponent implements OnInit {

  
	allCitys: MCityModel[] = [];
	unassignedCitys: MCityModel[] = [];
	assignedCitys: MCityModel[] = [];
	CityIdForAdding: number;
	CitysSubject = new BehaviorSubject<number[]>([]);
	
	Company: MCompanyModel;
	Company$: Observable<MCompanyModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	CompanyID: any;
	LocationID: any;
	issuperadmin: string;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CompanyeditComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<CompanyeditComponent>,
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
		
		if (this.data.id) {
			
			this.Company$ = this.store.pipe(select(selectCompanyById(this.data.id)));			
		} else {
			
			const newCompany = new MCompanyModel();
			newCompany.clear();
			this.Company$ = of(newCompany);
		}

		this.Company$.subscribe(res => {
			if (!res) {
				return;
			}			
			this.Company = new MCompanyModel();
			this.Company.id = res.id;
			this.Company.companyname = res.companyname;
			this.Company.cityid = res.cityid;
			this.Company.companyname = res.companyname;
			this.Company.shortname = res.shortname;
			this.Company.address1 = res.address1;
			this.Company.address2 = res.address2;
			this.Company.pincode = res.pincode;
			this.Company.isactive = true;
			this.Company.isCore = res.isCore;
			let x = []; 			
			x[0] = res.cityid;
			this.CitysSubject.next(x[0]);					
			this.CityIdForAdding = Number(res.cityid.toString());
		});
		this.auth.GetALLCity().subscribe((company: MCityModel[]) => {
			each(company, (_company: MCityModel) => {
				//if (_company.id == this.CityID) {
				this.allCitys.push(_company);
				this.unassignedCitys.push(_company);
				//}
			});
			// if (this.issuperadmin == "False") {
			// 	this.allCitys = this.allCitys;
			// 	this.unassignedCitys = this.unassignedCitys.filter(row => row.id == this.CityID);
			// }
			each([Number(this.CitysSubject.value.toString())], (roleId: number) => {
				const City = find(this.allCitys, (_City: MCityModel) => {
					return _City.id === roleId;
				});
				if (City) {
					this.assignedCitys.push(City);
					remove(this.unassignedCitys, City);
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
	 * Returns Company for save
	 */
	prepareCompany(): MCompanyModel {
		
		let loginid:number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid =  JSON.parse(localStorage.getItem('currentUser')).agentid;
          
		}
		
		const _Company = new MCompanyModel();
		_Company.id = this.Company.id;
		_Company.companyname = this.Company.companyname;
		_Company.cityid = this.Company.cityid;
		_Company.shortname = this.Company.shortname;
		_Company.address1 = this.Company.address1;
		_Company.address2 = this.Company.address2;
		_Company.pincode = this.Company.pincode;
		_Company.isactive = this.Company.isactive;
		_Company.cid = loginid;
		if (this.CityIdForAdding != undefined)
		_Company.cityid = this.CityIdForAdding.toString();
		else
		_Company.cityid = this.CitysSubject.value.toString();
		return _Company;
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
		const editedCompany = this.prepareCompany();
		if (editedCompany.id > 0) {
			this.updateCompany(editedCompany);
		} else {
			this.createCompany(editedCompany);
		}
	}

	/**
	 * Update Company
	 *
	 * @param _Company: Company
	 */
	updateCompany(_Company: MCompanyModel) {
		
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCompany(_Company).subscribe(data => {
			console.log('UpdateCompany Data received: ' + data)
		
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_Company,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create Company
	 *
	 * @param _Company: Company
	 */
	createCompany(_Company: MCompanyModel) {
    ;
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCompany(_Company).subscribe(data => {
			console.log('Inserted Data received: ' + data)
			this.viewLoading = false;
			this.dialogRef.close({
				_Company,
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
		if (this.Company && this.Company.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit Company '${this.Company.companyname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Company';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		
		return (this.Company && this.Company.companyname && this.Company.shortname.length && this.Company.address1.length && this.Company.pincode.length > 0 );
	}
}
