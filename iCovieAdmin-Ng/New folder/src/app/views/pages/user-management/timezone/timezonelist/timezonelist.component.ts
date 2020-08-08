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
import { MTimeZoneModel, TimeZonesDataSource, TimeZoneDeleted, TimeZonesPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { timezoneeditcomponent } from '../timezoneedit/timezoneedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-timezonelist',
  templateUrl: './timezonelist.component.html',
  styleUrls: ['./timezonelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class timezonelistcomponent implements OnInit {

  // Table fields
  public TimeZoneInfo: MTimeZoneModel[];
  public TimeZoneListData$ = new BehaviorSubject<MTimeZoneModel[]>(this.TimeZoneInfo);
  dataSource: TimeZonesDataSource;
  displayedColumns = ['select', 'timezone', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MTimeZoneModel>(true, []);
  public length: boolean = false;
  TimeZonesResult: MTimeZoneModel[] = [];
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
   * @param store: Store<AppTimeZone>
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
    let getCompanyTimeZone = this.auth.getItems();
    this.CompanyID = getCompanyTimeZone[0].CompanyID;
    this.LocationID = getCompanyTimeZone[0].LocationID;
    console.log('Company TimeZone One Time Configuration::: ' + JSON.stringify(getCompanyTimeZone));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center TimeZones'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('TimeZones');
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
        this.loadTimeZonesList();
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
        this.loadTimeZonesList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new TimeZonesDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
    
      if (res.length > 0) {
        this.TimeZonesResult = [];
         if (this.CompanyID == "0" && this.LocationID == "0")
           this.TimeZonesResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //    this.TimeZonesResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
          this.TimeZonesResult = res;
        if (this.TimeZonesResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.TimeZonesResult = [];
        this.length = true;
      }

      this.TimeZoneListData$.next(this.TimeZonesResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadTimeZonesList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load TimeZones List
   */
  loadTimeZonesList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new TimeZonesPageRequested({ page: queryParams }));
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
    // // filter.TimeZoneid = this.TimeZoneID; 
    //  filter.id = searchText;
    // filter.timezone = searchText;
    // filter.TimeZoneshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.timezone = searchText;
    //   filter.TimeZoneshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.TimeZoneid = this.TimeZoneID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.timezone = searchText;
   // filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete TimeZone
   *
   * @param _item: TimeZone
   */
  deleteTimeZone(_item: MTimeZoneModel) {

    const _title: string = 'TimeZone Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this TimeZone?';
    const _waitDesciption: string = 'TimeZone is deleting...';
    const _deleteMessage = `TimeZone has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteTimeZone(_item.id).subscribe(data => {
          console.log('TimeZone Deteleted conformationreceived: ' + data)
          this.store.dispatch(new TimeZoneDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadTimeZonesList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchTimeZones() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.timezone},${elem.id}`,
        id: elem.id.toString(),
        // TimeZone: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add TimeZone
   */
  addTimeZone() {
    const newTimeZone = new MTimeZoneModel();
    newTimeZone.clear(); // Set all defaults fields
    this.editTimeZone(newTimeZone);
  }

  /**
   * Edit TimeZone
   *
   * @param TimeZone: TimeZone
   */
  editTimeZone(TimeZone: MTimeZoneModel) {
    const _saveMessage = `TimeZone successfully has been saved.`;
    const _messageType = TimeZone.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(timezoneeditcomponent, { data: { id: TimeZone.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadTimeZonesList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.TimeZonesResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.TimeZonesResult.length) {
      this.selection.clear();
    } else {
      this.TimeZonesResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.TimeZoneID == "0") || (this.CompanyID == undefined && this.TimeZoneID == undefined))
    //   return false;
    // else
      return true;
  }
}
