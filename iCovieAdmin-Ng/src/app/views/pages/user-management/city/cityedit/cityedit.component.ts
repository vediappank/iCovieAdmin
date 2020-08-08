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
	MCityModel,
	MCityImagesModel,
	MCountryModel,
	Permission,
	selectCityById,
	CityUpdated,
	selectAllPermissions,
	selectAllCitys,

	selectLastCreatedCityId,
	CityOnServerCreated,
	MStateModel,
	MCompanyModel,
	MTimeZoneModel
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 



import { AuthService } from '../../../../../core/auth';
import { filter } from 'minimatch';
import { number } from '@amcharts/amcharts4/core';

@Component({
	selector: 'kt-cityedit',
	templateUrl: './cityedit.component.html',
	styleUrls: ['./cityedit.component.scss']
})
export class cityeditcomponent implements OnInit {


	allcountrys: MCountryModel[] = [];
	unassignedcountrys: MCountryModel[] = [];
	assignedcountrys: MCountryModel[] = [];
	countryIdForAdding: number;
	countrysSubject = new BehaviorSubject<number[]>([]);

	allstates: MStateModel[] = [];
	unassignedstates: MStateModel[] = [];
	assignedstates: MStateModel[] = [];
	stateIdForAdding: number;
	statesSubject = new BehaviorSubject<number[]>([]);

	allCompanys: MCompanyModel[] = [];
	unassignedCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);

	City: MCityModel;
	City$: Observable<MCityModel>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	// Private properties
	private componentSubscriptions: Subscription;
	countryID: any;
	stateID: any;
	selectedcountry: string;
	selectedstate: string;
	public defaultstates = [];
	public filterstates = [];
	countryid: number;
	stateid: number;

	public defaultcountrys = [];
	public Admindefaultcountrys = [];
	isadmin: any;

	issuperadmin: any;
	selectedImagesList: MCityImagesModel[] = [];
	editselectedImagesList: MCityImagesModel[] = [];
	ImagesList: MCityImagesModel;
	CityImagesrequest: MCityImagesModel;

	alltimezones: MTimeZoneModel[] = [];
	unassignedtimezones: MTimeZoneModel[] = [];
	assignedtimezones: MTimeZoneModel[] = [];
	timezoneIdForAdding: number;
	timezonesSubject = new BehaviorSubject<number[]>([]);

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<cityeditcomponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<cityeditcomponent>, private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<AppState>, public auth: AuthService) {
		let getcountrystate = this.auth.getItems();
		this.countryID = getcountrystate[0].countryID;
		this.stateID = getcountrystate[0].stateID;
		console.log('country state One Time Configuration::: ' + JSON.stringify(getcountrystate));
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (localStorage.hasOwnProperty('currentUser')) {
			this.countryID = JSON.parse(localStorage.getItem('currentUser')).countryid;
			this.stateID = JSON.parse(localStorage.getItem('currentUser')).stateid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		if (this.data.id) {

			this.City$ = this.store.pipe(select(selectCityById(this.data.id)));
		} else {

			const newCity = new MCityModel();
			newCity.clear();
			this.City$ = of(newCity);
		}
		this.City$.subscribe(res => {
			if (!res) {
				return;
			}

			this.City = new MCityModel();
			this.City.id = res.id;
			this.City.cityname = res.cityname;
			this.City.shortname = res.shortname;
			this.City.countryid = res.countryid;
			this.City.stateid = res.stateid;
			this.City.imagename = res.imagename;
			this.City.imagepath = res.imagepath;
			this.City.showimagepath = res.showimagepath;
			this.City.isCoreCategory = res.isCoreCategory;
			let x = [];
		
			x[0] = res.countryid;
			x[1] = res.stateid;
			x[2] = res.timezoneid;
			x[3] = res.companyid;
			this.countrysSubject.next(x[0]);
			this.countryIdForAdding = Number(x[0].toString());

			this.statesSubject.next(x[1]);
			this.stateIdForAdding = Number(x[1].toString());

			this.timezonesSubject.next(x[2]);
			this.timezoneIdForAdding = Number(x[2].toString());

			this.CompanysSubject.next(x[3]);
			this.CompanyIdForAdding = Number(x[3].toString());
			if (this.data.id > 0) {	
					this.ImagesList = {
						imagename: res.imagename,
						imagepath: res.imagepath,
						cityid: this.data.id,
						showimagepath: res.showimagepath
					}
					this.editselectedImagesList.push(this.ImagesList);
				
			}
		});
		

		this.auth.GetALLCompany().subscribe((company: MCompanyModel[]) => {			
			each(company, (_company: MCompanyModel) => {
				//if (_company.id == this.CompanyID) {
				this.allCompanys.push(_company);
				this.unassignedCompanys.push(_company);
				//}
			});
			// if (this.issuperadmin == "False") {
			// 	this.allCompanys = this.allCompanys.filter(row => row.id == this.CompanyID)
			// 	this.unassignedCompanys = this.unassignedCompanys.filter(row => row.id == this.CompanyID);
			// }
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

		this.auth.GetALLCountry().subscribe((users: MCountryModel[]) => {
			each(users, (_country: MCountryModel) => {
				this.allcountrys.push(_country);
				this.unassignedcountrys.push(_country);
			});
			if (this.issuperadmin == "False") {
				this.allcountrys = this.allcountrys.filter(row => row.id == this.countryID)
				this.unassignedcountrys = this.unassignedcountrys.filter(row => row.id == this.countryID);
			}
			each([Number(this.countrysSubject.value.toString())], (countryId: number) => {
				const country = find(this.allcountrys, (_country: MCountryModel) => {
					return _country.id === countryId;
				});
				if (country) {
					this.assignedcountrys.push(country);
					remove(this.unassignedcountrys, country);
				}
			});
		});

		this.auth.GetALLState().subscribe((users: MStateModel[]) => {
			each(users, (_state: MStateModel) => {
				this.allstates.push(_state);
				this.unassignedstates.push(_state);
			});
			if (this.issuperadmin == "False") {
				this.allstates = this.allstates.filter(row => row.id == this.countryID)
				this.unassignedstates = this.unassignedstates.filter(row => row.id == this.countryID);
			}
			each([Number(this.statesSubject.value.toString())], (stateId: number) => {
				const state = find(this.allstates, (_state: MStateModel) => {
					return _state.id === stateId;
				});
				if (state) {
					this.assignedstates.push(state);
					remove(this.unassignedstates, state);
				}
			});
		});

		this.auth.GetALLTimeZone().subscribe((timezone: MTimeZoneModel[]) => {
			each(timezone, (_timezone: MTimeZoneModel) => {
				this.alltimezones.push(_timezone);
				this.unassignedtimezones.push(_timezone);
			});
			// if (this.issuperadmin == "False") {
			// 	this.alltimezones = this.alltimezones.filter(row => row.id == this.countryID)
			// 	this.unassignedtimezones = this.unassignedtimezones.filter(row => row.id == this.countryID);
			// }
			each([Number(this.timezonesSubject.value.toString())], (timezoneId: number) => {
				const timezone = find(this.alltimezones, (_timezone: MTimeZoneModel) => {
					return _timezone.id === timezoneId;
				});
				if (timezone) {
					this.assignedtimezones.push(timezone);
					remove(this.unassignedtimezones, timezone);
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
	 * Returns City for save
	 */
	prepareCity(): MCityModel {
		let loginid: number;
		if (localStorage.hasOwnProperty('currentUser')) {
			loginid = JSON.parse(localStorage.getItem('currentUser')).agentid;

		}
		const _City = new MCityModel();
		if (this.countryIdForAdding != undefined)
			_City.countryid = Number(this.countryIdForAdding);
		else
			_City.countryid = Number(this.countrysSubject.value);

		if (this.stateIdForAdding != undefined)
			_City.stateid = Number(this.stateIdForAdding);
		else
			_City.stateid = Number(this.statesSubject.value);

		if (this.timezoneIdForAdding != undefined)
			_City.timezoneid = Number(this.timezoneIdForAdding);
		else
			_City.timezoneid = Number(this.timezonesSubject.value);
		
			if (this.CompanyIdForAdding != undefined)
			_City.companyid = this.CompanyIdForAdding;
	else
	_City.companyid = Number(this.CompanysSubject.value);

		_City.id = this.City.id;
		_City.cityname = this.City.cityname;
		_City.shortname = this.City.shortname;
		// _City.countryid = this.City.countryid;
		// _City.stateid = this.City.stateid;
		_City.cid = loginid;
		return _City;
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
		const editedCity = this.prepareCity();
		if (editedCity.id > 0) {
			this.updateCity(editedCity);
		} else {
			this.createCity(editedCity);
		}
	}

	/**
	 * Update City
	 *
	 * @param _City: City
	 */
	updateCity(_City: MCityModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateCity(_City).subscribe(CityID => {
			console.log('Inserted Data received: ' + CityID)
			
			console.log('UpdateProperty Data received: ' + CityID)
			if (CityID > 0) {
				this.uploadFiles(Number(CityID));

			}

			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_City,
					isEdit: true
				});
			});
		});// Remove this line
	}

	/**
	 * Create City
	 *
	 * @param _City: City
	 */
	createCity(_City: MCityModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createCity(_City).subscribe(CityID => {
			console.log('Inserted Data received: ' + CityID)
			
			console.log('UpdateProperty Data received: ' + CityID)
			if (CityID > 0) {
				this.uploadFiles(Number(CityID));

			}
			this.viewLoading = false;
			this.dialogRef.close({
				_City,
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


	getstateBycountry() {
		if (this.allstates.length > 0) {
			this.unassignedstates = this.allstates.filter(row => row.countryid == Number(this.countryIdForAdding));
		}
		this.stateIdForAdding = this.unassignedstates[0].id;
	}
	getCountryByCompany() {		
		if (this.allcountrys.length > 0) {
			this.unassignedcountrys = this.allcountrys.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.countryIdForAdding = this.unassignedcountrys[0].id;
	}
	/** */
	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.City && this.City.id) {
			// tslint:disable-next-line:no-string-throw
			return `Edit City '${this.City.cityname}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New City';
	}

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {

		return (this.City && this.City.cityname.length > 0);
		// return (this.City && this.City.cityname && this.City.shortname.length > 0 && this.countryIdForAdding != undefined);
	}

	UpadteCityImages() {
		this.auth.updateCityImages(this.editselectedImagesList).subscribe(
			data => {
			}
		);
	}

	urls = [];
	myFiles: string[] = [];
	
	onSelectFile(event) {
	
		if (event.target.files && event.target.files[0]) {
			var filesAmount = event.target.files.length;
			for (let i = 0; i < filesAmount; i++) {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					console.log(event.target.result);
					this.urls.push(event.target.result);					
				}			
				this.myFiles.push(event.target.files[i]);
				reader.readAsDataURL(event.target.files[i]);
			}
		}
	}

	uploadFiles(cityid: number): MCityImagesModel[] {
		if (cityid == undefined)
		cityid = 0;
		const frmData = new FormData();
		for (var i = 0; i < this.myFiles.length; i++) {
			frmData.append("fileUpload" + i + '-' + cityid, this.myFiles[i]);
		}

		this.auth.AddCityImage(frmData).subscribe((_CityImagesModel: MCityImagesModel[]) => {
			this.selectedImagesList = _CityImagesModel;
			if (_CityImagesModel.length > 0) {
				for (let i = 0; i < _CityImagesModel.length; i++) {
					this.ImagesList = {
						imagename: _CityImagesModel[i].imagename,
						imagepath: _CityImagesModel[i].imagepath,
						cityid: _CityImagesModel[i].cityid,
						showimagepath: _CityImagesModel[i].showimagepath,
					}
					this.editselectedImagesList.push(this.ImagesList)
				}
				this.UpadteCityImages();
				console.log('Uploaded Images::' + JSON.stringify(this.editselectedImagesList))
			}
			else {
				this.UpadteCityImages();
			}
		});

		

		return this.editselectedImagesList;
	}
}
