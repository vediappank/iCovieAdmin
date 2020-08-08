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
import { MLocationModel, LocationsDataSource, LocationDeleted, LocationsPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { LocationeditComponent } from '../locationedit/locationedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-Locationlist',
  templateUrl: './Locationlist.component.html',
  styleUrls: ['./Locationlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationlistComponent implements OnInit {

  // Table fields
  public LocationInfo: MLocationModel[];
  public LocationListData$ = new BehaviorSubject<MLocationModel[]>(this.LocationInfo);
  dataSource: LocationsDataSource;
  displayedColumns = ['select','companyname', 'locationname', 'shortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MLocationModel>(true, []);
  public length: boolean = false;
  LocationsResult: MLocationModel[] = [];
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
    let getCompanyLocation = this.auth.getItems();
    this.CompanyID = getCompanyLocation[0].CompanyID;
    this.LocationID = getCompanyLocation[0].LocationID;
    console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Locations'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('locations');
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
        this.loadLocationsList();
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
        this.loadLocationsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new LocationsDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
    
      if (res.length > 0) {
        this.LocationsResult = [];
         if (this.CompanyID == "0" && this.LocationID == "0")
           this.LocationsResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //    this.LocationsResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
          this.LocationsResult = res;
        if (this.LocationsResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.LocationsResult = [];
        this.length = true;
      }

      this.LocationListData$.next(this.LocationsResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadLocationsList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Locations List
   */
  loadLocationsList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new LocationsPageRequested({ page: queryParams }));
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
    // // filter.locationid = this.LocationID; 
    //  filter.id = searchText;
    // filter.Locationname = searchText;
    // filter.Locationshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Locationname = searchText;
    //   filter.Locationshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.locationid = this.LocationID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.locationname = searchText;
    filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Location
   *
   * @param _item: Location
   */
  deleteLocation(_item: MLocationModel) {

    const _title: string = 'Location Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Location?';
    const _waitDesciption: string = 'Location is deleting...';
    const _deleteMessage = `Location has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteLocation(_item.id).subscribe(data => {
          console.log('Location Deteleted conformationreceived: ' + data)
          this.store.dispatch(new LocationDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadLocationsList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchLocations() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.companyname},${elem.locationname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Location: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Location
   */
  addLocation() {
    const newLocation = new MLocationModel();
    newLocation.clear(); // Set all defaults fields
    this.editLocation(newLocation);
  }

  /**
   * Edit Location
   *
   * @param Location: Location
   */
  editLocation(Location: MLocationModel) {
    const _saveMessage = `Location successfully has been saved.`;
    const _messageType = Location.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(LocationeditComponent, { data: { id: Location.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadLocationsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.LocationsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.LocationsResult.length) {
      this.selection.clear();
    } else {
      this.LocationsResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.LocationID == "0") || (this.CompanyID == undefined && this.LocationID == undefined))
    //   return false;
    // else
      return true;
  }
}
