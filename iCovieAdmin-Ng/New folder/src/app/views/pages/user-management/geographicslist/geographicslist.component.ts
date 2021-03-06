// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { FormControl } from '@angular/forms';
import { each, find, remove } from 'lodash';
import { Role, selectAllRoles } from '../../../../core/auth';




// Services and Models
import {
	User,
	UserUpdated,
	selectHasUsersInStore,
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	selectUsersActionLoading,
	AuthService
} from '../../../../core/auth';
import { Options } from 'selenium-webdriver/safari';
import { stringify } from 'querystring';
import { number } from '@amcharts/amcharts4/core';
//import { ConsoleReporter } from 'jasmine';



@Component({
  selector: 'kt-geographicslist',
  templateUrl: './geographicslist.component.html',
  styleUrls: ['./geographicslist.component.scss']
})
export class GeographicslistComponent implements  OnInit, OnDestroy {
	// Public properties


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

	allAgentActivity$: Observable<User[]>;
	allActivity: User[] = [];
	unassignedActivity: User[] = [];
	assignedActivity: User[] = [];
	AcitivityIdForAdding: number;
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

	public UserActivityHistory: History[];
	public UserRoleHistory: History[];
	public UserCCRoleHistory: History[];
	public UserSupervisorHistory: History[];

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
					if (res) {
						this.user = res;
						this.rolesSubject.next(this.user.userroleid);
						this.CompanySubject.next(this.user.usercompanyid);
						this.LocationSubject.next(this.user.userlocationid);
						this.oldUser = Object.assign({}, this.user);
						this.CompanyIdForAdding = Number(this.user.usercompanyid.toString());
						this.LocationIdForAdding = Number(this.user.userlocationid.toString());
						this.roleIdForAdding = Number(this.user.userroleid.toString());
						this.initUser();
						//Location
						// this.defaultLocations = JSON.parse(localStorage.getItem('defaultlocations'));
						// each(this.defaultLocations.filter(row => row.id != "0"), (_Location: any) => {
						// 	if (_Location.companyid == this.user.usercompanyid) {
						// 		this.allLocation.push(_Location);
						// 		this.unassignedLocation.push(_Location);
						// 	}
						// 	each([Number(this.LocationSubject.value.toString())], (_LocationId: number) => {
						// 		const _Location = find(this.allLocation.filter(row => row.id != "0"), (_Location: User) => {
						// 			return _Location.id === _LocationId;
						// 		});
						// 		if (_Location) {
						// 			this.assignedLocation.push(_Location);
						// 			this.selectedLocation = _Location.locationname;
						// 			//remove(this.unassignedLocation, _Location);
						// 		}
						// 	});
						// });
					}
				});
			} else {
				this.user = new User();
				this.user.clear();
				this.rolesSubject.next(this.user.userroleid);
				this.CompanySubject.next(this.user.usercompanyid);
				this.LocationSubject.next(this.user.userlocationid);
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
			
			if (this.isadmin == "True") {
				this.allCompany = this.allCompany.filter(row => row.id == this.companyid)
				this.unassignedCompany = this.unassignedCompany.filter(row => row.id == this.companyid);
			}
			else if (this.issuperadmin == "True") {
				this.allCompany = this.allCompany;
				this.unassignedCompany = this.unassignedCompany;
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
			if (this.isadmin == "True") {
				this.CompanyList.push(_companyList.find(row => row.id == this.companyid));
				if (this.CompanyList.length > 0)
					this.getAllLocation(this.CompanyList[0].id);
			}
			else if (this.issuperadmin == "True") {
				this.CompanyList.push(_companyList);
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

	getAllLocations(event) {
		let locationid = event;
		this.unassignedLocation = [];
		//DropDown Ativity		
		this.auth.GetALLLocation().subscribe(_locationList => {
			this.LocationList = _locationList;
			each(this.LocationList, (_Company: any) => {
				if (_Company.companyid == locationid)
					this.unassignedLocation.push(_Company);
			});
			if (this.isadmin == "False" && this.issuperadmin == "False") {				
				this.unassignedLocation = this.unassignedLocation.filter(row => row.id == this.locationid && row.companyid == this.companyid);
			}
		});
	}
	getAllRoles(event) {

		this.unassignedRoles = [];

		// this.auth.getAllRoles().subscribe((res: Role[]) => {
		// 	each(res, (_role: Role) => {
		// 		// if (_role.companyid == this.companyid) {
		// 			this.allRoles.push(_role);

		// 		// }
		// 	});
		// });
		//DropDown Ativity	
		this.unassignedRoles = this.allRoles.filter(row => row.locationid == Number(event) && row.companyid == Number(this.CompanyIdForAdding));
		// this.RolesList = this.defaultRoles;
		// each(this.allRoles, (_Role: any) => {
		// 	if (_Role.locationid == event)
		// 		this.unassignedRoles.push(_Role);
		// });

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
			//userccrolename: [this.user.userccrolename],
			//userCompanyname: [this.user.userCompanyname]
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

		const editedUser = this.prepareUser();
		if (editedUser.id > 0) {
			this.updateUser(editedUser, withBack);
			return;
		}
		this.addUser(editedUser, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		//
		const controls = this.userForm.controls;
		//const Activitycontrols = this.userActivityForm.controls;
		//const Rolecontrols = this.userRoleForm.controls;
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

		_user.refreshToken = this.user.refreshToken;
		_user.id = this.user.id;
		_user.username = controls['username'].value;
		_user.email = controls['email'].value;
		if (_user.email == undefined || !_user.email)
			_user.email = '';
		_user.firstname = controls['firstname'].value;
		_user.lastname = controls['lastname'].value;
		_user.profile_img = './assets/media/users/300_21.jpg';
		//_user.contactno = controls['contactno'].value;
		_user.password = this.user.password;


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
				//if (newId) {
				// if (withBack) {
				// 	this.goBackWithId();
				// } else {
				// 	this.refreshUser(true, newId);
				// }
				//}
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
		// Update User
		// tslint:disable-next-line:prefer-const

		const updatedUser: Update<User> = {
			id: _user.id,
			changes: _user
		};
		//
		///this.store.dispatch(new UserUpdated({ partialUser: updatedUser, user: _user }));

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
		let result = 'Geographical Settings';
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
}


