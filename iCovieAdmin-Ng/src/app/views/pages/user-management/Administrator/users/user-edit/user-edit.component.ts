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
	unassignedcountrys: MCountryModel[] = [];
	assignedcountrys: MCountryModel[] = [];
	countryIdForAdding: number;
	countrysSubject = new BehaviorSubject<number[]>([]);

	allstates: MStateModel[] = [];
	unassignedstates: MStateModel[] = [];
	assignedstates: MStateModel[] = [];
	stateIdForAdding: number;
	statesSubject = new BehaviorSubject<number[]>([]);

	allcitys: MCityModel[] = [];
	unassignedcitys: MCityModel[] = [];
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
	unassignedSupervisor: User[] = [];
	assignedSupervisor: User[] = [];
	allCompany: any[] = [];
	unassignedCompany: any[] = [];
	assignedCompany: any[] = [];

	allLocation: any[] = [];
	unassignedLocation: any[] = [];
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
	unassignedRoles: Role[] = [];
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
					debugger;
					if (res) {
						this.user = res;
						//this.rolesSubject.next(this.user.userroleid);
						//this.CompanySubject.next(this.user.usercompanyid);
						//this.LocationSubject.next(this.user.userlocationid);
						let x = [];
debugger;
						x[0] = this.user.countryid;
						x[1] = this.user.stateid;
						x[2] = this.user.cityid;

						this.rolesSubject.next(this.user.userroleid);
						this.CompanySubject.next(this.user.usercompanyid);
						this.LocationSubject.next(this.user.userlocationid);

						this.countrysSubject.next(x[0]);
						if (x[0] != undefined)
							this.countryIdForAdding = Number(x[0].toString());
						else
							this.countryIdForAdding = 0;

						this.statesSubject.next(x[1]);
						if (x[1] != undefined)
							this.stateIdForAdding = Number(x[1].toString());
						else
							this.stateIdForAdding = 0;

						this.citysSubject.next(x[2]);
						if (x[2] != undefined)
							this.cityIdForAdding = Number(x[2].toString());
						else
							this.cityIdForAdding = 0;

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
				let x = [];

				x[0] = this.user.countryid;
				x[1] = this.user.stateid;
				x[2] = this.user.cityid;

				this.rolesSubject.next(this.user.userroleid);
				this.CompanySubject.next(this.user.usercompanyid);
				this.LocationSubject.next(this.user.userlocationid);

				if (x[0] != undefined)
					this.countryIdForAdding = Number(x[0].toString());
				else
					this.countryIdForAdding = 0;

				this.statesSubject.next(x[1]);
				if (x[1] != undefined)
					this.stateIdForAdding = Number(x[1].toString());
				else
					this.stateIdForAdding = 0;

				this.citysSubject.next(x[2]);
				if (x[1] != undefined)
					this.cityIdForAdding = Number(x[2].toString());
				else
					this.cityIdForAdding = 0;

				this.oldUser = Object.assign({}, this.user);
				this.initUser();
			}
		});

		this.subscriptions.push(routeSubscription);

		//Company
		this.auth.GetALLCompany().subscribe(_companyList => {

			this.CompanyList = _companyList;
			each(this.CompanyList, (_Company: any) => {
				this.allCompany.push(_Company);
				this.unassignedCompany.push(_Company);
			});
			if (this.issuperadmin == "True") {
				this.allCompany = this.allCompany;
				this.unassignedCompany = this.unassignedCompany;
			}
			else if (this.isadmin == "True") {
				this.allCompany = this.allCompany.filter(row => row.id == this.companyid)
				this.unassignedCompany = this.unassignedCompany.filter(row => row.id == this.companyid);
			}
			else {
				this.allCompany = this.allCompany.filter(row => row.id == this.companyid)
				this.unassignedCompany = this.unassignedCompany.filter(row => row.id == this.companyid);
			}


			each([Number(this.CompanySubject.value.toString())], (_CompanyId: number) => {
				const _Company = find(this.allCompany, (_Company: any) => {
					return _Company.id === _CompanyId;
				});
				if (_Company) {
					this.assignedCompany.push(_Company);
					this.selectedCompany = _Company.companyname;
					//remove(this.unassignedCompany, _Company);
				}
			});
		});




		//Location
		this.auth.GetALLLocation().subscribe(_locationList => {
			this.LocationList = _locationList;
			each(this.LocationList, (_Location: any) => {
				if (_Location.companyid == this.user.usercompanyid) {
					this.allLocation.push(_Location);
					this.unassignedLocation.push(_Location);
				}

				each([Number(this.LocationSubject.value.toString())], (_LocationId: number) => {
					const _Location = find(this.allLocation, (_Location: User) => {
						return _Location.id === _LocationId;
					});
					if (_Location) {
						this.assignedLocation.push(_Location);
						this.selectedLocation = _Location.locationname;
						//remove(this.unassignedLocation, _Location);
					}
				});
			});
			if (this.isadmin == "False" && this.issuperadmin == "False") {
				this.allLocation = this.allLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid)
				this.unassignedLocation = this.unassignedLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
		});

		this.auth.GetALLCountry().subscribe((users: MCountryModel[]) => {

			each(users, (_country: MCountryModel) => {
				this.allcountrys.push(_country);
				this.unassignedcountrys.push(_country);
			});
			if (this.issuperadmin == "False") {
				this.allcountrys = this.allcountrys.filter(row => row.id == this.companyid)
				this.unassignedcountrys = this.unassignedcountrys.filter(row => row.companyid == this.companyid);
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
				this.allstates = this.allstates.filter(row => row.id == this.companyid)
				this.unassignedstates = this.unassignedstates.filter(row => row.id == this.companyid);
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

		this.auth.GetALLCity().subscribe((users: MCityModel[]) => {
			debugger;
			each(users, (_city: MCityModel) => {
				this.allcitys.push(_city);
				this.unassignedcitys.push(_city);
			});
			if (this.issuperadmin == "False") {
				this.allcitys = this.allcitys.filter(row => row.id == this.companyid)
				this.unassignedcitys = this.unassignedcitys.filter(row => row.id == this.companyid);
			}
			each([Number(this.citysSubject.value.toString())], (cityId: number) => {
				const city = find(this.allcitys, (_city: MCityModel) => {
					return _city.id === cityId;
				});
				if (city) {
					this.assignedcitys.push(city);
					remove(this.unassignedcitys, city);
				}
			});
		});
0




		//Roles
		//this.allUserRoles$ = this.store.pipe(select(selectAllRoles));

		this.auth.getAllRoles().subscribe((res: Role[]) => {
			each(res, (_role: Role) => {
				// if (_role.companyid == this.companyid) {
				this.allRoles.push(_role);
				this.unassignedRoles.push(_role);
				// }
			});
		});

		this.auth.getAllRoles().subscribe((res: Role[]) => {
			let selectedRole: any;
			selectedRole = res.filter(row => row.id == Number(this.rolesSubject.value.toString()));
			if (selectedRole.length > 0) {
				this.assignedRoles.push(selectedRole[0]);
				remove(this.unassignedRoles, selectedRole[0]);
			}

		});
		if (this.companyid != undefined && this.companyid != 0 && this.locationid != undefined && this.locationid != 0)
			this.unassignedRoles = this.allRoles.filter(row => row.locationid == Number(this.locationid) && row.companyid == Number(this.companyid));
	}

	selectToday() {
		//this.model = this.calendar.getToday();
	}

	getAgentRoles() {
		//CCRoles Ativity
		this.auth.getAllRoles().subscribe((_roles: any[]) => {
			this.RolesList = _roles
		});
	}

	getAllCompany() {
		this.auth.GetALLCompany().subscribe(_companyList => {
			console.log('Getall Company Data Response Came::::' + JSON.stringify(_companyList));
			console.log('this.isadmin:::' + this.isadmin);
			if (this.issuperadmin == "True") {
				this.CompanyList.push(_companyList);
				if (this.CompanyList.length > 0)
					this.getAllLocation(this.CompanyList[0].id);
			}
			else if (this.isadmin == "True") {
				this.CompanyList.push(_companyList.find(row => row.id == this.companyid));
				if (this.CompanyList.length > 0)
					this.getAllLocation(this.CompanyList[0].id);
			}
			else {
				this.CompanyList.push(_companyList.find(row => row.id == this.companyid));
				if (this.CompanyList.length > 0)
					this.getAllLocation(this.CompanyList[0].id);
			}
		});

	}


	getAllLocation(companyid) {
		//DropDown Ativity		
		this.auth.GetALLLocation().subscribe(_locationList => {
			this.LocationList = _locationList.filter(row => row.id != "0");
			each(this.LocationList, (_Company: any) => {
				if (_Company.companyid == companyid)
					this.unassignedLocation.push(_Company);
			});
			if (this.isadmin == "False" && this.issuperadmin == "False") {
				this.unassignedLocation = this.unassignedLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
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
			//this.subheaderService.setTitle('Create user');
			// this.subheaderService.setBreadcrumbs([
			// 	{ title: 'User Management', page: `user-management` },
			// 	{ title: 'Users', page: `user-management/users` },
			// 	{ title: 'Create user', page: `user-management/users/add` }
			// ]);
			return;
		}
		//this.subheaderService.setTitle('Edit user');
		// this.subheaderService.setBreadcrumbs([
		// 	{ title: 'User Management', page: `user-management` },
		// 	{ title: 'Users', page: `user-management/users` },
		// 	{ title: 'Edit user', page: `user-management/users/edit`, queryParams: { id: this.user.id } }
		// ]);

		this.getAgentRoles();
		//this.getAllCompany();

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
		if (this.roleIdForAdding != undefined)
			_user.roleid = this.roleIdForAdding;
		else
			_user.roleid = Number(this.rolesSubject.value);
		if (this.CompanyIdForAdding != undefined)
			_user.companyid = Number(this.CompanyIdForAdding);
		else
			_user.companyid = Number(this.CompanySubject.value);

		if (this.LocationIdForAdding != undefined)
			_user.locationid = Number(this.LocationIdForAdding);
		else
			_user.locationid = Number(this.LocationSubject.value);

		if (this.stateIdForAdding != undefined)
			_user.stateid = Number(this.stateIdForAdding);
		else
			_user.stateid = Number(this.statesSubject.value);

		if (this.cityIdForAdding != undefined)
			_user.cityid = Number(this.cityIdForAdding);
		else
			_user.cityid = Number(this.citysSubject.value);

		if (this.countryIdForAdding != undefined)
			_user.countryid = Number(this.countryIdForAdding);
		else
			_user.countryid = Number(this.countrysSubject.value);

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
		//_user.contactno = controls['contactno'].value;
		//_user.password = this.user.password;


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
			this.assignedRoles.push(role);
			remove(this.unassignedRoles, role);
			this.roleIdForAdding = 0;
			this.updateRoles();
		}
	}

	/**
	 * Unassign role
	 *
	 * @param role: Role
	 */
	unassingRole(role: Role) {
		this.roleIdForAdding = 0;
		this.unassignedRoles.push(role);
		remove(this.assignedRoles, role);
		this.updateRoles();
	}

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
			this.unassignedstates = this.allstates.filter(row => row.countryid == Number(this.countryIdForAdding));
		}
		this.stateIdForAdding = this.unassignedstates[0].id;
	}
	getCityByState() {
		if (this.allcitys.length > 0) {
			this.unassignedcitys = this.allcitys.filter(row => row.stateid == Number(this.stateIdForAdding));
		}
		this.cityIdForAdding = this.unassignedcitys[0].id;
	}
	getCountryByCompany() {
		if (this.allcountrys.length > 0) {
			this.unassignedcountrys = this.allcountrys.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.countryIdForAdding = this.unassignedcountrys[0].id;
	}


	getAllLocations(event) {
		this.CompanyIdForAdding = Number(event.value);
		//let comid = Number(event.value);
		this.unassignedLocation = [];
		//DropDown Ativity		
		this.auth.GetALLLocation().subscribe(_locationList => {
			debugger;
			this.LocationList = _locationList;
			each(this.LocationList, (_Company: any) => {
				if (_Company.companyid == Number(event.value))
					this.unassignedLocation.push(_Company);
			});
			if (this.isadmin == "False" && this.issuperadmin == "False") {
				this.unassignedLocation = this.unassignedLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
		});
		this.getCountryByCompany();
	}
	getAllRoles(event) {
		this.unassignedRoles = [];
		this.unassignedRoles = this.allRoles.filter(row => row.locationid == Number(event.value) && row.companyid == Number(this.CompanyIdForAdding));
	}
}
