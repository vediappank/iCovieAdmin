// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { FormControl } from '@angular/forms';
import { each, find, remove } from 'lodash';
import { Role, selectAllRoles } from '../../../../../../core/auth';




// Services and Models
import {
	User,
	UserUpdated,
	selectHasUsersInStore,
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	selectUsersActionLoading,
	AuthService,
	MCountryModel,
	MStateModel,
	MCityModel
} from '../../../../../../core/auth';
import { Options } from 'selenium-webdriver/safari';
import { stringify } from 'querystring';
import { number } from '@amcharts/amcharts4/core';
//import { ConsoleReporter } from 'jasmine';



@Component({
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties


	allcountrys: MCountryModel[] = [];
	filteredcountrys: MCountryModel[] = [];
	assignedcountrys: MCountryModel[] = [];
	countryIdForAdding: number;
	countrysSubject = new BehaviorSubject<number[]>([]);

	allstates: MStateModel[] = [];
	filteredstates: MStateModel[] = [];
	assignedstates: MStateModel[] = [];
	stateIdForAdding: number;
	statesSubject = new BehaviorSubject<number[]>([]);

	allcitys: MCityModel[] = [];
	filteredcitys: MCityModel[] = [];
	assignedcitys: MCityModel[] = [];
	cityIdForAdding: number;
	citysSubject = new BehaviorSubject<number[]>([]);

	Agents: any[] = [];
	selectedFDGroups: any[] = [];
	selectedPeople: any;
	source: Array<any>;
	confirmed: Array<any>;
	public selected_fd_groups: string;

	public isCollapsed = false;
	user: User;
	userId$: Observable<number>;
	oldUser: User;
	selectedTab: number = 0;
	loading$: Observable<boolean>;
	rolesSubject = new BehaviorSubject<number[]>([]);
	ccRolesSubject = new BehaviorSubject<number[]>([]);
	ActivitySubject = new BehaviorSubject<number[]>([]);
	SupervisorSubject = new BehaviorSubject<number[]>([]);
	CompanySubject = new BehaviorSubject<number[]>([]);
	LocationSubject = new BehaviorSubject<number[]>([]);

	userForm: FormGroup;
	userRoleForm: FormGroup;
	userActivityForm: FormGroup;
	hasFormErrors: boolean = false;
	hasFormErrors1: boolean = false;
	activityIdForAdding: number;
	activityenddate: string;
	// Private properties
	private subscriptions: Subscription[] = [];



	supervisorIdForAdding: number;
	CompanyIdForAdding: number;
	LocationIdForAdding: number;
	allAgentSupervisor$: Observable<User[]>;
	allSupervisor: User[] = [];
	filteredSupervisor: User[] = [];
	assignedSupervisor: User[] = [];
	allCompany: any[] = [];
	filteredCompany: any[] = [];
	assignedCompany: any[] = [];

	allLocation: any[] = [];
	filteredLocation: any[] = [];
	assignedLocation: any[] = [];

	myControl = new FormControl();
	public UserList: User[];
	public ActivityList: User[];
	public CCRolesList: User[];
	public RolesList: any[];

	filteredOptions: Observable<User[]>;
	public UserList$: Observable<User[]>
	public CompanyList: any[];
	public LocationList: any[];



	loadingSubject = new BehaviorSubject<boolean>(false);
	private _dateTimeObj: string;

	// Roles
	allUserRoles$: Observable<Role[]>;
	allRoles: Role[] = [];
	filteredRoles: Role[] = [];
	assignedRoles: Role[] = [];
	roleIdForAdding: number;
	selectedCompany: any;
	selectedLocation: any;
	companyid: any;
	isadmin: any;
	locationid: any;
	public _resCompany: any[];
	defaultLocations: any;
	defaultRoles: any;
	issuperadmin: any;



	/**
	 * Component constructor
	 *	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param userAcivityFB: FormBuilder
	 * * @param userRoleFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */



	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private userFB: FormBuilder,
		private userAcivityFB: FormBuilder,
		private userRoleFB: FormBuilder,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private store: Store<AppState>,
		private calendar: NgbCalendar,
		private auth: AuthService,

		private layoutConfigService: LayoutConfigService) {
		this.confirmed = [];
		let getCompanyLocation = this.auth.getItems();
		this.companyid = getCompanyLocation[0].CompanyID;
		this.locationid = getCompanyLocation[0].LocationID;
		console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));
	}

	public model: string;


	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {

		if (localStorage.hasOwnProperty('currentUser')) {
			this.companyid = JSON.parse(localStorage.getItem('currentUser')).companyid;
			this.locationid = JSON.parse(localStorage.getItem('currentUser')).locationid;
			this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
			this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
		}
		this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
		this.model = new Date().toISOString().split('T')[0];
		this.loading$ = this.store.pipe(select(selectUsersActionLoading));

		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.store.pipe(select(selectUserById(Number(id)))).subscribe(res => {

					if (res) {
						this.user = res;

						this.countryIdForAdding = Number(this.user.countryid);
						this.stateIdForAdding = Number(this.user.stateid);
						this.cityIdForAdding = Number(this.user.cityid);

						this.oldUser = Object.assign({}, this.user);
						this.CompanyIdForAdding = Number(this.user.usercompanyid.toString());
						this.LocationIdForAdding = Number(this.user.userlocationid.toString());
						this.roleIdForAdding = Number(this.user.userroleid.toString());
						this.initUser();

					}
				});
			} else {
				this.user = new User();
				this.user.clear();
				this.countryIdForAdding = Number(this.user.countryid);
				this.stateIdForAdding = Number(this.user.stateid);
				this.cityIdForAdding = Number(this.user.cityid);

				this.oldUser = Object.assign({}, this.user);
				this.CompanyIdForAdding = Number(this.user.usercompanyid.toString());
				this.LocationIdForAdding = Number(this.user.userlocationid.toString());
				this.roleIdForAdding = Number(this.user.userroleid.toString());
				this.initUser();

				this.oldUser = Object.assign({}, this.user);
				this.initUser();
			}
		});

		this.subscriptions.push(routeSubscription);

		//Company
		this.auth.GetALLCompany().subscribe(_companyList => {

			this.allCompany = _companyList;
			this.filteredCompany = this.allCompany;
			if (this.issuperadmin == "True") {
				this.filteredCompany = this.allCompany;
			}
			else if (this.isadmin == "True") {
				this.filteredCompany = this.allCompany.filter(row => row.id == this.companyid);
			}
			else {
				this.filteredCompany = this.allCompany.filter(row => row.id == this.companyid);
			}

			this.getAllLocation(this.filteredCompany[0].id);
			this.getCountryByCompanyID(this.filteredCompany[0].id);
		});
		//Location


		this.auth.GetALLState().subscribe((_state: MStateModel[]) => {
			this.allstates = _state;
			this.filteredstates = this.allstates;

		});

		this.auth.GetALLCity().subscribe((_city: MCityModel[]) => {
			this.allcitys = _city;
			this.filteredcitys = _city;

		});


	}






	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	/**
	 * Init user
	 */
	initUser() {
		this.createForm();
		if (!this.user.id) {
			return;
		}
	}



	/**
	 * Create form
	 */
	createForm() {
		this.userForm = this.userFB.group({
			username: [this.user.username, Validators.required],
			firstname: [this.user.firstname, Validators.required],
			//contactno: [this.user.contactno, Validators.required],
			email: [this.user.email, Validators.email],
			lastname: [this.user.lastname],
			password: [this.user.password, Validators.required],
			confirmpassword: [this.user.confirmpassword, Validators.required]
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/user-management/users`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/users/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.hasFormErrors1 = false;
		this.userForm.markAsPristine();
		this.userForm.markAsUntouched();
		this.userForm.updateValueAndValidity();

		this.userActivityForm.markAsPristine();
		this.userActivityForm.markAsUntouched();
		this.userActivityForm.updateValueAndValidity();

		this.userRoleForm.markAsPristine();
		this.userRoleForm.markAsUntouched();
		this.userRoleForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {

		this.hasFormErrors = false;
		this.hasFormErrors1 = false;
		const controls = this.userForm.controls;
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		if (this.CompanyIdForAdding == undefined || this.CompanyIdForAdding.toString() == "0") {
			alert("Please select the company");
			return;
		}
		else if (this.LocationIdForAdding == undefined || this.LocationIdForAdding.toString() == "0") {
			alert("Please select the location");
			return;
		}
		else if (this.roleIdForAdding == undefined || this.roleIdForAdding.toString() == "0") {
			alert("Please select the role");
			return;
		}
		if (this.validateConfirmPassword()) {
			const editedUser = this.prepareUser();
			if (editedUser.id > 0) {
				this.updateUser(editedUser, withBack);
				return;
			}
			this.addUser(editedUser, withBack);
		}
		else {
			alert("Password & Confirm Password Should be same");
			return;
		}
	}

	validateConfirmPassword(): boolean {
		const controls = this.userForm.controls;
		if (controls['password'].value == controls['confirmpassword'].value)
			return true;
		else
			return false;

	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.userroleid = this.rolesSubject.value;
		_user.usercompanyid = this.CompanySubject.value;
		_user.userlocationid = this.LocationSubject.value;

		_user.roleid = this.roleIdForAdding;

		_user.companyid = Number(this.CompanyIdForAdding);

		_user.locationid = Number(this.LocationIdForAdding);

		_user.stateid = Number(this.stateIdForAdding);

		_user.cityid = Number(this.cityIdForAdding);

		_user.countryid = Number(this.countryIdForAdding);


		_user.refreshToken = this.user.refreshToken;
		_user.id = this.user.id;
		_user.username = controls['username'].value;
		_user.email = controls['email'].value;
		if (_user.email == undefined || !_user.email)
			_user.email = '';
		_user.firstname = controls['firstname'].value;
		_user.lastname = controls['lastname'].value;
		_user.confirmpassword = controls['confirmpassword'].value;
		_user.password = controls['password'].value;
		_user.profile_img = './assets/media/users/300_21.jpg';
		return _user;
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = false) {
		//this.store.dispatch(new UserOnServerCreated({ user: _user }));
		this.auth.createUser(_user).subscribe(newId => {
			const message = `New user successfully has been added.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Create, 3000, true, true);
			if (newId == "SUCCESS") {
				this.router.navigate(['/user-management/users']);

			}


		});
		//this.subscriptions.push(addSubscription);
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false) {
		const updatedUser: Update<User> = {
			id: _user.id,
			changes: _user
		};
		this.auth.updateUser(_user).subscribe(data => {
			console.log('Data received: ' + data)
			console.log('User Upadted Status ::::' + data);
			if (data == "SUCCESS") {
				this.router.navigate(['/user-management/users']);
				withBack = true;
				const message = `User successfully has been saved.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 5000, true, true);
				if (withBack) {
					this.goBackWithId();
				} else {
					this.refreshUser(false);
				}
			}
		});


	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Create user';
		if (!this.user || !this.user.id) {
			return result;
		}
		result = `Edit user - ${this.user.firstname}`;
		return result;
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	/**
	 * Assign role
	 */
	assignRole() {
		if (this.roleIdForAdding === 0) {
			return;
		}
		const role = find(this.allRoles, (_role: Role) => {
			return _role.id === (+this.roleIdForAdding);
		});
		if (role) {

			this.roleIdForAdding = 0;
			this.updateRoles();
		}
	}

	/**
	 * Unassign role
	 *
	 * @param role: Role
	 */


	/**
	 * Update roles
	 */
	updateRoles() {
		const _roles = [];
		each(this.assignedRoles, elem => _roles.push(elem.id));
		this.rolesSubject.next(_roles);
	}

	getStateByCountry() {
		if (this.allstates.length > 0) {
			this.filteredstates = this.allstates.filter(row => row.countryid == Number(this.countryIdForAdding));
		}
		this.stateIdForAdding = this.filteredstates[0].id;
		this.getCityByStateID(this.filteredstates[0].id);
	}
	
	getStateByCountryID(countryID: number) {
		if (this.allstates.length > 0) {
			this.filteredstates = this.allstates.filter(row => row.countryid == Number(countryID));
		}
		this.stateIdForAdding = this.filteredstates[0].id;
		this.getCityByStateID(this.filteredstates[0].id);
	}

	getCityByState() {
		if (this.allcitys.length > 0) {
			this.filteredcitys = this.allcitys.filter(row => row.stateid == Number(this.stateIdForAdding));
		}
		this.cityIdForAdding = this.filteredcitys[0].id;
	}
	getCityByStateID(stateid:number) {
		if (this.allcitys.length > 0) {
			this.filteredcitys = this.allcitys.filter(row => row.stateid == Number(stateid));
		}
		this.cityIdForAdding = this.filteredcitys[0].id;
	}

	getCountryByCompanyID(companyid: number) {
		this.auth.GetALLCountry().subscribe((_country: MCountryModel[]) => {
			this.allcountrys = _country;
			this.filteredcountrys = this.allcountrys.filter(row => row.companyid == Number(this.companyid));
			this.getStateByCountryID(this.filteredcountrys[0].id);
		});
	}
	getCountryByCompany() {
		if (this.allcountrys.length > 0) {
			this.filteredcountrys = this.allcountrys.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.countryIdForAdding = this.filteredcountrys[0].id;
	}

	getAgentRoles(companyid: number, locationid: number) {
		//Roles
		this.auth.getAllRoles().subscribe((_role: Role[]) => {
			this.allRoles = _role;
			this.filteredRoles = this.allRoles;
			if (companyid > 0 && locationid > 0)
				this.filteredRoles = this.allRoles.filter(row => row.locationid == Number(locationid) && row.companyid == Number(companyid));

		});
	}


	getAllLocation(companyid: number) {
		//DropDown Ativity		
		this.auth.GetALLLocation().subscribe(_locationList => {
			this.filteredLocation = _locationList.filter(row => row.companyid == companyid);

			if (this.isadmin == "False" && this.issuperadmin == "False") {
				this.filteredLocation = this.filteredLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
			this.getAgentRoles(companyid, this.filteredLocation[0].id);
		});

	}


	getAllLocations(event) {
		this.CompanyIdForAdding = Number(event.value);
		this.filteredLocation = [];
		this.auth.GetALLLocation().subscribe(_locationList => {
			this.LocationList = _locationList;
			each(this.LocationList, (_Company: any) => {
				if (_Company.companyid == Number(event.value))
					this.filteredLocation.push(_Company);
			});
			if (this.isadmin == "False" && this.issuperadmin == "False") {
				this.filteredLocation = this.filteredLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
		});

	}
	getAllRoles(event) {
		this.filteredRoles = [];
		this.filteredRoles = this.allRoles.filter(row => row.locationid == Number(event.value) && row.companyid == Number(this.CompanyIdForAdding));
	}
}
