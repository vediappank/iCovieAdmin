// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
import { MWingModel,WingsDataSource,  WingDeleted, WingsPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { WingeditComponent } from '../wingedit/wingedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-Winglist',
  templateUrl: './Winglist.component.html',
  styleUrls: ['./Winglist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WinglistComponent implements OnInit {

  // Table fields
  
  public WingInfo: MWingModel[];
  public WingListData$ = new BehaviorSubject<MWingModel[]>(this.WingInfo);
  dataSource: WingsDataSource;
  displayedColumns = ['select','companyname','locationname','buildingname','floorname', 'unitsname','shortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MWingModel>(true, []);
  public length: boolean = false;
  WingsResult: MWingModel[] = [];
  public viewFlag: Boolean = false;
  public addFlag: Boolean = false;
  public editFlag: Boolean = false;
  public deleteFlag: Boolean = false;
  public adminmenucontrol : Boolean = true; 
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
    localStorage.setItem('adminmenucontrol','true');
  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Wings'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    
    let value = localStorage.getItem('wings');
    
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
        this.loadWingsList();
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
        this.loadWingsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new WingsDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      this.WingsResult = res;
      if (res.length > 0) {
        this.WingsResult = [];
        if (this.CompanyID == "0" && this.LocationID == "0")
          this.WingsResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //   this.WingsResult = res.filter(row => row.companyid == Number(this.CompanyID) );
        else
         this.WingsResult = res;
        if (this.WingsResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.WingsResult = [];
        this.length = true;
      }

      this.WingListData$.next(this.WingsResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadWingsList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Wings List
   */
  loadWingsList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new WingsPageRequested({ page: queryParams }));
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
    // filter.Wingname = searchText;
    // filter.Wingshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Wingname = searchText;
    //   filter.Wingshortname = searchText;
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
    filter.wingname = searchText;
    filter.shortname = searchText;
    filter.companyname = searchText;
    filter.locationname = searchText;
    filter.buildingname = searchText;
    filter.floorname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Wing
   *
   * @param _item: Wing
   */
  deleteWing(_item: MWingModel) {

    const _title: string = 'Unit Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Wing?';
    const _waitDesciption: string = 'Wing is deleting...';
    const _deleteMessage = `Wing has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteWing(_item.id).subscribe(data => {
          console.log('Wing Deteleted conformationreceived: ' + data)
          this.store.dispatch(new WingDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadWingsList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchWings() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.unitsname},${elem.floorname},${elem.locationname},${elem.companyname},${elem.buildingname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Wing: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Wing
   */
  addWing() {
    const newWing = new MWingModel();
    newWing.clear(); // Set all defaults fields
    this.editWing(newWing);
  }

  /**
   * Edit Wing
   *
   * @param Wing: Wing
   */
  editWing(Wing: MWingModel) {
    
    const _saveMessage = `Wing successfully has been saved.`;
    const _messageType = Wing.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(WingeditComponent, { data: { id: Wing.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadWingsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.WingsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.WingsResult.length) {
      this.selection.clear();
    } else {
      this.WingsResult.forEach(row => this.selection.select(row));
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
