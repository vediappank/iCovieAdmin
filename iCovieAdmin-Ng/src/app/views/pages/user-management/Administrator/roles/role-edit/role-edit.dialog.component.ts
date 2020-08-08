// Angular
import { Component, OnInit, Inject, Injectable, ChangeDetectionStrategy, OnDestroy, ViewChild, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Lodash
import { each, find, some, remove } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';


// State
import { AppState } from '../../../../../../core/reducers';

// Services and Models
import {
	Role,
	Permission,
	selectRoleById,
	RoleUpdated,
	selectAllPermissions,
	selectAllRoles,

	selectLastCreatedRoleId,
	RoleOnServerCreated,
	MCompanyModel,
	MLocationModel
} from '../../../../../../core/auth';
import { delay } from 'rxjs/operators';

//START MAT TREE 

import { privilege } from '../../../../../../core/auth/_models/privilege.model'
import { AuthService } from '../../../../../../core/auth';
import { filter } from 'minimatch';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'kt-role-edit-dialog',
	templateUrl: './role-edit.dialog.component.html',
	styleUrls: ['./role-edit.dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default

})
export class RoleEditDialogComponent implements OnInit, OnDestroy {

	mainmenufromArray: Array<Permission> = [];
	mainmenuPriviegefromArrays: Array<any> = [];
	menuCollection: Array<any> = [];
	privilegeCollection: Array<privilege> = [];
	role: Role;
	filterMenus: any;
	filterMenustring: any;
	role$: Observable<Role>;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	allPermissions$: Observable<Permission[]>;
	rolePermissions: Permission[] = [];
	// Private properties
	private componentSubscriptions: Subscription;
	public lastAction: string;
	public selectedMMArray: any[] = [];
	public selectedPRArray: any[] = [];
	CompanyID: number;
	LocationID: number;

	allCompanys: MCompanyModel[] = [];
	filteredCompanys: MCompanyModel[] = [];
	assignedCompanys: MCompanyModel[] = [];
	CompanyIdForAdding: number;
	CompanysSubject = new BehaviorSubject<number[]>([]);

	allLocations: MLocationModel[] = [];
	filteredLocations: MLocationModel[] = [];
	assignedLocations: MLocationModel[] = [];
	LocationIdForAdding: number;
	LocationsSubject = new BehaviorSubject<number[]>([]);
	isadmin: any;
	issuperadmin: any;


	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(public dialogRef: MatDialogRef<RoleEditDialogComponent>,
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
		if (this.data.roleId) {
			this.role$ = this.store.pipe(select(selectRoleById(this.data.roleId)));
			this.getMainMenu(this.data.roleId);
			this.getAllPrivileges();

		} else {
			this.getMainMenu(0);
			this.getAllPrivileges();
			const newRole = new Role();
			newRole.clear();
			this.role$ = of(newRole);
		}

		this.role$.subscribe(res => {
			if (!res) {
				return;
			}
			this.role = new Role();
			this.role.id = res.id;
			this.role.RoleName = res.RoleName;
			this.role.RoleShortName = res.RoleShortName;
			this.role.permissions = res.permissions;
			this.role.isCoreRole = res.isCoreRole;
			this.role.isadmin = res.isadmin;
			if (res.companyids != undefined && res.companyids.toString() != '') {
				this.CompanysSubject.next(res.companyids);
				this.CompanyIdForAdding = Number(res.companyids.toString());
			}
			if (res.locationids != undefined && res.locationids.toString() != '') {
				this.LocationsSubject.next(res.locationids);
				this.LocationIdForAdding = Number(res.locationids.toString());
			}
			//alert(this.role.isCoreRole);
		});

		this.auth.GetALLCompany().subscribe((_company: MCompanyModel[]) => {			
				this.allCompanys= _company;
				this.filteredCompanys= _company;			
			if (this.issuperadmin == "True") {
				this.allCompanys = this.allCompanys;
				this.filteredCompanys = this.allCompanys;
			}
			else if (this.isadmin == "True") {
				this.allCompanys = this.allCompanys.filter(row => row.id == this.CompanyID)
				this.filteredCompanys = this.allCompanys.filter(row => row.id == this.CompanyID);
			}
			this.getLocation(this.filteredCompanys[0].id);
			
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

	getLocation(compnayid:number)
	{
		this.auth.GetALLLocation().subscribe((_location: MLocationModel[]) => {		
			this.allLocations= _location;
			this.filteredLocations= _location.filter(row=>row.companyid == compnayid);
	});
	}

	//Load MainMenu
	getMainMenu(roleid: number) {

		this.auth.GetAllMainMenu(roleid).subscribe((_mainMenus: any) => {
			console.log('MainMenu collection:: Response::' + JSON.stringify(_mainMenus));
			this.menuCollection = _mainMenus;
			if (this.menuCollection.length > 0) {
				this.selectedMMArray = [];
				this.selectedPRArray = [];
				if (this.menuCollection.length > 0) {
					for (let j = 0; j < this.menuCollection.length; j++) {
						//if (j > 0) {
						if (this.menuCollection[j].hasOwnProperty("submenu")) {
							if (this.menuCollection[j].submenu.length > 0) {
								for (let k = 0; k < this.menuCollection[j].submenu.length; k++) {
									this.selectedMMArray.push(this.menuCollection[j].submenu[k].parentMenuId + '-' + this.menuCollection[j].submenu[k].menuId + '-' + this.menuCollection[j].submenu[k].title);
									this.selectedPRArray.push(this.menuCollection[j].submenu[k].privilegeid + '-' + this.menuCollection[j].submenu[k].privilegename);
								}
							}
						}
						else {
							this.selectedMMArray.push(this.menuCollection[j].menuId + '-' + 'NOSUBMENU' + '-' + this.menuCollection[j].title);
							this.selectedPRArray.push(this.menuCollection[j].privilegeid + '-' + this.menuCollection[j].privilegename);
						}
					}
				}
				this.mainmenuPriviegefromArrays = [];
				for (let i = 0; i < this.selectedMMArray.length; i++) {
					let Menus: string;
					Menus = this.selectedMMArray[i].split('-');
					let priv: string;
					priv = this.selectedPRArray[i].split('-')
					this.mainmenuPriviegefromArrays.push({ "menuId": Menus[0], "submenuId": Menus[1], "title": Menus[2], "privilegeid": priv[0], "privilegename": priv[1] });
				}
			}
		});
	}

	getAllPrivileges() {
		this.auth.GetAllPrivileges().subscribe((_privilege: privilege[]) => {
			console.log('getAllPrivileges collection:: Response::' + JSON.stringify(_privilege));
			this.privilegeCollection = _privilege;
		});
	}

	/**
	 * Returns role for save
	 */
	prepareRole(): Role {
		const _role = new Role();

		_role.id = this.role.id;
		_role.permissions = this.mainmenuPriviegefromArrays;
			_role.companyid = Number(this.CompanyIdForAdding);		
			_role.locationid = Number(this.LocationIdForAdding);
		_role.RoleName = this.role.RoleName;
		_role.RoleShortName = this.role.RoleShortName;
		_role.isCoreRole = this.role.isCoreRole;
		_role.isadmin = this.role.isadmin;		
		return _role;
	}

	/**
	 * Save data
	 */
	onSubmit() {

		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		/** check form */
		if (!this.isTitleValid()) {
			this.hasFormErrors = true;
			return;
		}
		const editedRole = this.prepareRole();
		if (editedRole.id > 0) {
			this.updateRole(editedRole);
		} else {
			this.createRole(editedRole);
		}
	}

	/**
	 * Update role
	 *
	 * @param _role: Role
	 */
	updateRole(_role: Role) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.updateRole(_role).subscribe(data => {
			console.log(' updateRole Data received: ' + data)
			if (Number(data.split('~')[1]) == -1) {
				this.viewLoading = false;
				alert(data.split('~')[0]);
				return false;
				
			}
			else {
			of(undefined).pipe(delay(1000)).subscribe(() => { // Remove this line
				this.viewLoading = false;
				this.dialogRef.close({
					_role,
					isEdit: true
				});
			});
		}
		});// Remove this line
	}

	/**
	 * Create role
	 *
	 * @param _role: Role
	 */
	createRole(_role: Role) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.auth.createRole(_role).subscribe(data => {		
			console.log('Data received: ' + data)
			if (Number(data.split('~')[1]) == -1) {
				this.viewLoading = false;
				alert(data.split('~')[0]);
				return false;				
			}
			else {
				this.viewLoading = false;
				this.dialogRef.close({
					_role,
					isEdit: false
				});
			}
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

	getLocationByCompany() {
		if (this.allLocations.length > 0) {
			this.filteredLocations = this.allLocations.filter(row => row.companyid == Number(this.CompanyIdForAdding));
		}
		this.LocationIdForAdding = this.filteredLocations[0].id;
	}

	/** UI */
	/**
	 * Returns component title
	 */
	getTitle(): string {
		if (this.role && this.role.id) {
			// tslint:disable-next-line:no-string-throw

			return `Edit Role '${this.role.RoleName}'`;
		}
		// tslint:disable-next-line:no-string-throw
		return 'New Role';
	}
	getAssignTitle(): string {

		if (this.role && this.role.id) {
			return `Modifiy Menu Permissions`;
		}

		return 'Assign Menu Permissions';
	}
	

	/**
	 * Returns is title valid
	 */
	isTitleValid(): boolean {
		return (this.role && this.role.RoleName && this.role.RoleName.length > 0);
	}

	onChange(event, Selectdata: any) {
		if (event.checked) {
			Selectdata.privilegeid = Number(3);
			this.mainmenufromArray.push(Selectdata);
		} else {
			let index = this.mainmenufromArray.indexOf(Selectdata);
			this.mainmenufromArray.splice(index, 1);
		}
	}

	onEditChangePrivilege(event, Selectdata: any) {

		if (event.source.checked) {
			var nameArr = event.source.name.split('-');
			if (nameArr.length > 2) {
				Selectdata.sub_menu_id = nameArr[2];
				Selectdata.menu_menu_id = nameArr[0];
				Selectdata.sub_menu_name = nameArr[1];
			}
			else {
				Selectdata.sub_menu_id = 'NOSUBMENU';
				Selectdata.menu_menu_id = nameArr[1];
				Selectdata.sub_menu_name = nameArr[0];
			}

			let index: any;
			if (this.selectedMMArray.length > 0) {
				index = this.selectedMMArray.indexOf(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
				if (index < 0) {
					this.selectedMMArray.push(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
					this.selectedPRArray.push(event.value + '-' + Selectdata.privilege_name);
				}
				else
					this.selectedPRArray.splice(index, 1, event.value + '-' + Selectdata.privilege_name);
			}
			else {
				this.selectedMMArray.push(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
				this.selectedPRArray.push(event.value + '-' + Selectdata.privilege_name);
			}
			this.mainmenuPriviegefromArrays = [];
			for (let i = 0; i < this.selectedMMArray.length; i++) {
				let Menus: string;
				Menus = this.selectedMMArray[i].split('-');
				let priv: string;
				priv = this.selectedPRArray[i].split('-')
				this.mainmenuPriviegefromArrays.push({ "menuId": Menus[0], "submenuId": Menus[1], "title": Menus[2], "privilegeid": priv[0], "privilegename": priv[1] });
			}
		}
		console.log('Menu Wise Privileges:::' + JSON.stringify(this.mainmenuPriviegefromArrays));
	}

	onChangePrivilege(event, Selectdata: any) {

		if (event.source.checked) {
			var nameArr = event.source.name.split('-');
			if (nameArr.length > 2) {
				Selectdata.sub_menu_id = nameArr[2];
				Selectdata.menu_menu_id = nameArr[0];
				Selectdata.sub_menu_name = nameArr[1];
			}
			else {
				Selectdata.sub_menu_id = 'NOSUBMENU';
				Selectdata.menu_menu_id = nameArr[1];
				Selectdata.sub_menu_name = nameArr[0];
			}

			let index: any;
			if (this.selectedMMArray.length > 0) {
				index = this.selectedMMArray.indexOf(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
				if (index < 0) {
					this.selectedMMArray.push(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
					this.selectedPRArray.push(event.value + '-' + Selectdata.privilege_name);
				}
				else
					this.selectedPRArray.splice(index, 1, event.value + '-' + Selectdata.privilege_name);
			}
			else {
				this.selectedMMArray.push(Selectdata.menu_menu_id + '-' + Selectdata.sub_menu_id + '-' + Selectdata.sub_menu_name);
				this.selectedPRArray.push(event.value + '-' + Selectdata.privilege_name);
			}
			this.mainmenuPriviegefromArrays = [];
			for (let i = 0; i < this.selectedMMArray.length; i++) {
				let Menus: string;
				Menus = this.selectedMMArray[i].split('-');
				let priv: string;
				priv = this.selectedPRArray[i].split('-')
				this.mainmenuPriviegefromArrays.push({ "menuId": Menus[0], "submenuId": Menus[1], "title": Menus[2], "privilegeid": priv[0], "privilegename": priv[1] });
			}
		}
		console.log('Menu Wise Privileges:::' + JSON.stringify(this.mainmenuPriviegefromArrays));

	}
	duplicate() {
		console.log(JSON.stringify(this.mainmenuPriviegefromArrays));
	}
}


