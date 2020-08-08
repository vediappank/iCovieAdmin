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
import { MRegionModel, RegionsDataSource, RegionDeleted, RegionsPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { regioneditcomponent } from '../regionedit/regionedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-regionlist',
  templateUrl: './regionlist.component.html',
  styleUrls: ['./regionlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class regionlistcomponent implements OnInit {

  // Table fields
  public RegionInfo: MRegionModel[];
  public RegionListData$ = new BehaviorSubject<MRegionModel[]>(this.RegionInfo);
  dataSource: RegionsDataSource;
  displayedColumns = ['select' ,'regionname','countryname', 'shortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MRegionModel>(true, []);
  public length: boolean = false;
  RegionsResult: MRegionModel[] = [];
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
    let getCompanyRegion = this.auth.getItems();
    this.CompanyID = getCompanyRegion[0].CompanyID;
    this.LocationID = getCompanyRegion[0].LocationID;
    console.log('Company Region One Time Configuration::: ' + JSON.stringify(getCompanyRegion));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Regions'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('Regions');
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
        this.loadRegionsList();
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
        this.loadRegionsList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new RegionsDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
    
      if (res.length > 0) {
        this.RegionsResult = [];
         if (this.CompanyID == "0" && this.LocationID == "0")
           this.RegionsResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //    this.RegionsResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
          this.RegionsResult = res;
        if (this.RegionsResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.RegionsResult = [];
        this.length = true;
      }

      this.RegionListData$.next(this.RegionsResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadRegionsList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Regions List
   */
  loadRegionsList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new RegionsPageRequested({ page: queryParams }));
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
    // // filter.Regionid = this.RegionID; 
    //  filter.id = searchText;
    // filter.Regionname = searchText;
    // filter.Regionshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Regionname = searchText;
    //   filter.Regionshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.Regionid = this.RegionID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.Regionname = searchText;
    filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Region
   *
   * @param _item: Region
   */
  deleteRegion(_item: MRegionModel) {

    const _title: string = 'Region Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Region?';
    const _waitDesciption: string = 'Region is deleting...';
    const _deleteMessage = `Region has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteRegion(_item.id).subscribe(data => {
          console.log('Region Deteleted conformationreceived: ' + data)
          this.store.dispatch(new RegionDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadRegionsList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchRegions() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.countryname},${elem.regionname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Region: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Region
   */
  addRegion() {
    const newRegion = new MRegionModel();
    newRegion.clear(); // Set all defaults fields
    this.editRegion(newRegion);
  }

  /**
   * Edit Region
   *
   * @param Region: Region
   */
  editRegion(Region: MRegionModel) {
    const _saveMessage = `Region successfully has been saved.`;
    const _messageType = Region.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(regioneditcomponent, { data: { id: Region.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadRegionsList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.RegionsResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.RegionsResult.length) {
      this.selection.clear();
    } else {
      this.RegionsResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.RegionID == "0") || (this.CompanyID == undefined && this.RegionID == undefined))
    //   return false;
    // else
      return true;
  }
}
