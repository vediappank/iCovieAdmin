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
import { MFloorModel,FloorsDataSource,  FloorDeleted, FloorsPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { FlooreditComponent } from '../flooredit/flooredit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-Floorlist',
  templateUrl: './Floorlist.component.html',
  styleUrls: ['./Floorlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorlistComponent implements OnInit {

  // Table fields
  public FloorInfo: MFloorModel[];
  public FloorListData$ = new BehaviorSubject<MFloorModel[]>(this.FloorInfo);
  dataSource: FloorsDataSource;
  displayedColumns = ['select','companyname','locationname','buildingname', 'floorname','shortname', 'action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MFloorModel>(true, []);
  public length: boolean = false;
  FloorsResult: MFloorModel[] = [];
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
    // let getCompanyLocation = this.auth.getItems();
    // this.CompanyID = getCompanyLocation[0].CompanyID;
    // this.LocationID = getCompanyLocation[0].LocationID;
    // console.log('Company Location One Time Configuration::: ' + JSON.stringify(getCompanyLocation));

    this.CompanyID = JSON.parse(localStorage.getItem('currentUser')).companyid;
    this.LocationID = JSON.parse(localStorage.getItem('currentUser')).locationid;

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Floors'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('floors');
    
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
        this.loadFloorsList();
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
        this.loadFloorsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new FloorsDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      this.FloorsResult = res;
       if (res.length > 0) {
        this.FloorsResult = [];
        if (this.CompanyID == "0" && this.LocationID == "0")
          this.FloorsResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //   this.FloorsResult = res.filter(row => row.companyid == Number(this.CompanyID) );
        else
          this.FloorsResult = res;
        if (this.FloorsResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.FloorsResult = [];
        this.length = true;
      }

      this.FloorListData$.next(this.FloorsResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadFloorsList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Floors List
   */
  loadFloorsList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new FloorsPageRequested({ page: queryParams }));
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
    // filter.Floorname = searchText;
    // filter.Floorshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Floorname = searchText;
    //   filter.Floorshortname = searchText;
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
    filter.floorname = searchText;
    filter.shortname = searchText;
    filter.companyname = searchText;
    filter.locationname = searchText;
    filter.buildingname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Floor
   *
   * @param _item: Floor
   */
  deleteFloor(_item: MFloorModel) {

    const _title: string = 'Floor Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Floor?';
    const _waitDesciption: string = 'Floor is deleting...';
    const _deleteMessage = `Floor has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteFloor(_item.id).subscribe(data => {
          console.log('Floor Deteleted conformationreceived: ' + data)
          this.store.dispatch(new FloorDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadFloorsList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchFloors() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.floorname},${elem.locationname},${elem.companyname},${elem.buildingname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Floor: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Floor
   */
  addFloor() {
    const newFloor = new MFloorModel();
    newFloor.clear(); // Set all defaults fields
    this.editFloor(newFloor);
  }

  /**
   * Edit Floor
   *
   * @param Floor: Floor
   */
  editFloor(Floor: MFloorModel) {
    
    const _saveMessage = `Floor successfully has been saved.`;
    const _messageType = Floor.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(FlooreditComponent, { data: { id: Floor.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadFloorsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.FloorsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.FloorsResult.length) {
      this.selection.clear();
    } else {
      this.FloorsResult.forEach(row => this.selection.select(row));
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
