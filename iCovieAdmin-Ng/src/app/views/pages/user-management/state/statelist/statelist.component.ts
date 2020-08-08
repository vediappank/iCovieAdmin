// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
import { MStateModel, StatesDataSource, StateDeleted, StatesPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { stateeditcomponent } from '../stateedit/stateedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-statelist',
  templateUrl: './statelist.component.html',
  styleUrls: ['./statelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class statelistcomponent implements OnInit {

  // Table fields
  public StateInfo: MStateModel[];
  public StateListData$ = new BehaviorSubject<MStateModel[]>(this.StateInfo);
  dataSource: StatesDataSource;
  displayedColumns = ['select','companyname','countryname', 'statename', 'shortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MStateModel>(true, []);
  public length: boolean = false;
  StatesResult: MStateModel[] = [];
  public viewFlag: Boolean = false;
  public addFlag: Boolean = false;
  public editFlag: Boolean = false;
  public deleteFlag: Boolean = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  CompanyID: any;
  LocationID: any;

  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   * @param dialog: MatDialog
   * @param snackBar: MatSnackBar
   * @param layoutUtilsService: LayoutUtilsService
   */
  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService, public auth: AuthService) {
    let getCompanyState = this.auth.getItems();
    this.CompanyID = getCompanyState[0].CompanyID;
    this.LocationID = getCompanyState[0].LocationID;
    console.log('Company State One Time Configuration::: ' + JSON.stringify(getCompanyState));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center States'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('States');
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
    console.log('Activity Menu Permission:::' + value);


    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => {
        this.loadStatesList();
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
        this.loadStatesList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new StatesDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
    
      if (res.length > 0) {
        this.StatesResult = [];
         if (this.CompanyID == "0" && this.LocationID == "0")
           this.StatesResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //    this.StatesResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
          this.StatesResult = res;
        if (this.StatesResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.StatesResult = [];
        this.length = true;
      }

      this.StateListData$.next(this.StatesResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadStatesList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load States List
   */
  loadStatesList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new StatesPageRequested({ page: queryParams }));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    // const filter: any = {};
    // const searchText: string = this.searchInput.nativeElement.value;

    // if(searchText=='')
    // {
    //  filter.companyid = this.CompanyID;
    // // filter.Stateid = this.StateID; 
    //  filter.id = searchText;
    // filter.Statename = searchText;
    // filter.Stateshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Statename = searchText;
    //   filter.Stateshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.Stateid = this.StateID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.Statename = searchText;
    filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete State
   *
   * @param _item: State
   */
  deleteState(_item: MStateModel) {

    const _title: string = 'State Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this State?';
    const _waitDesciption: string = 'State is deleting...';
    const _deleteMessage = `State has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteState(_item.id).subscribe(data => {
          console.log('State Deteleted conformationreceived: ' + data)
          this.store.dispatch(new StateDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadStatesList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchStates() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.countryname},${elem.statename},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // State: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add State
   */
  addState() {
    const newState = new MStateModel();
    newState.clear(); // Set all defaults fields
    this.editState(newState);
  }

  /**
   * Edit State
   *
   * @param State: State
   */
  editState(State: MStateModel) {
    const _saveMessage = `State successfully has been saved.`;
    const _messageType = State.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(stateeditcomponent, { data: { id: State.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadStatesList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.StatesResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.StatesResult.length) {
      this.selection.clear();
    } else {
      this.StatesResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.StateID == "0") || (this.CompanyID == undefined && this.StateID == undefined))
    //   return false;
    // else
      return true;
  }
}
