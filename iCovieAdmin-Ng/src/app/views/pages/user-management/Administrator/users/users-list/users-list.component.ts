import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/reducers';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles
} from '../../../../../../core/auth';
import { SubheaderService } from '../../../../../../core/_base/layout';
import { AuthService } from '../../../../../../core/auth';
import { JsonPipe } from '@angular/common';
// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {
	// Table fields
	dataSource: UsersDataSource;
	displayedColumns = ['select', 'company', 'location', 'username', 'firstname', 'lastname', 'roles', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] = [];

	public viewFlag: Boolean = true;
	public addFlag: Boolean = true;
	public editFlag: Boolean = true;
	public deleteFlag: Boolean = true;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	companyid: any;
	locationid: any;
	length: boolean = false;
	isadmin: any;
	issuperadmin: any;


	constructor(private auth: AuthService,
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef) {
			if (localStorage.hasOwnProperty('currentUser')) {
				this.companyid = JSON.parse(localStorage.getItem('currentUser')).companyid;
				this.locationid = JSON.parse(localStorage.getItem('currentUser')).locationid;
				this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
				this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
			}
		///let getCompanyLocation = this.auth.getItems();
		//this.companyid = getCompanyLocation[0].CompanyID;
		//this.LocationID = getCompanyLocation[0].LocationID;
		//console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		//this.router.navigate([this.router.url]);
		//Load Permission
		let value = localStorage.getItem('Users');
		//		
		switch (value) {
			case "NONE": {
				this.addFlag = this.viewFlag = this.deleteFlag = this.editFlag = true;
				break;
			}
			case "VIEW": {
				this.viewFlag = false;
				break;
			}
			case "VIEWEDIT": {
				this.viewFlag = this.editFlag = false;
				break;
			}
			case "VIEWEDITDELETE": {
				this.viewFlag = this.deleteFlag = this.editFlag = false;
				break;
			}
			case "VIEWEDITADD": {
				this.addFlag = this.editFlag = this.editFlag = false;
				break;
			}
			case "VIEWEDITADDDELETE": {
				this.addFlag = this.viewFlag = this.deleteFlag = this.editFlag = false;
				break;
			}
		}
		console.log('User Menu Permission:::' + value);
		// load roles list
		const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
		this.subscriptions.push(rolesSubscription);

		// If the user changes the sort order, reset back to the first page.
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadUsersList();
			})
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);
		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadUsersList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Set title to page breadCrumbs
		//this.subheaderService.setTitle('User management');

		// Init DataSource
		this.dataSource = new UsersDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			if (res.length > 0) {
				this.usersResult = [];
				 if(this.issuperadmin =="True")				
					this.usersResult = res;		
					else if(this.isadmin =="True")				
					this.usersResult = res.filter(row => row.companyid == Number(this.companyid) );	
				else				
					this.usersResult = res.filter(row => row.companyid == Number(this.companyid) && row.locationid == Number(this.locationid));
				
				if (this.usersResult.length == 0)
					this.length = true;
				else
					this.length = false;
			}
			else {
				this.usersResult = [];
				this.length = true;
			}

			console.log('User Collection::::' + JSON.stringify(this.usersResult));
		});
		this.subscriptions.push(entitiesSubscription);

		// First Load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadUsersList();
		});
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load users list
	 */
	loadUsersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new UsersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;
		filter.firstname = searchText;
		filter.id = searchText;
		filter.companyname = searchText;
		filter.locationname = searchText;
		filter.occupation = searchText;
		filter.callcenter = searchText;
		filter.lastname = searchText;
		filter.username = searchText;
		filter.email = searchText;
		console.log('user list filters:::' + JSON.stringify(filter));
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(_item: User) {
		const _title: string = 'User Delete Confirmation?';
		const _description: string = 'Are you sure to permanently delete this User?';
		const _waitDesciption: string = 'User is deleting...';
		const _deleteMessage = `User has been deleted`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.auth.deleteUser(_item.id).subscribe(data => {
					console.log('User Deleted confirmation received: ' + data)
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.loadUsersList();
				});
			}
		});
	}

	/**
	 * Fetch selected rows
	 */
	fetchUsers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.firstname},${elem.userroleid},${elem.username}, ${elem.email}`,
				id: elem.id.toString(),
				status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns user roles string
	 *
	 * @param user: User
	 */
	getUserRolesStr(user: User): string {
		const titles: string[] = [];
		each(user.userroleid, (roleId: number) => {
			const _role = find(this.allRoles, (role: Role) => role.id === roleId);
			if (_role) {
				titles.push(_role.RoleName);
			}
		});
		return titles.join(', ');
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editUser(id) {
		this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	}
}
