// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Input } from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// NGRX
import { Store } from '@ngrx/store';
// Services
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
// Models
import { NeighbourhoodCategoryModel,NeighbourhoodCategorysDataSource,  NeighbourhoodCategoryDeleted, NeighbourhoodCategorysPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { NeighbourhoodcategoryeditComponent } from '../neighbourhoodcategoryedit/neighbourhoodcategoryedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-neighbourhoodcategory',
  templateUrl: './neighbourhoodcategory.component.html',
  styleUrls: ['./neighbourhoodcategory.component.scss']
})
export class NeighbourhoodcategoryComponent implements OnInit {

 
  // Table fields
  public NeighbourhoodCategoryInfo: NeighbourhoodCategoryModel[];
  public NeighbourhoodCategoryListData$ = new BehaviorSubject<NeighbourhoodCategoryModel[]>(this.NeighbourhoodCategoryInfo);
  dataSource: NeighbourhoodCategorysDataSource;
  displayedColumns = ['select','neighbourhoodcategory', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // @ViewChild('currenturl', { static: true }) currenturl: UserProfile2Component;
  // Selection
  selection = new SelectionModel<NeighbourhoodCategoryModel>(true, []);
  public length: boolean = false;
  NeighbourhoodCategorysResult: NeighbourhoodCategoryModel[] = [];
  public viewFlag: Boolean = false;
  public addFlag: Boolean = false;
  public editFlag: Boolean = false;
  public deleteFlag: Boolean = false;
  public visiblity : boolean = false;
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
    private layoutUtilsService: LayoutUtilsService, public auth: AuthService,
    private router: Router) {  
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
    //alert(localStorage.getItem('Call Center NeighbourhoodCategorys'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('neighbourhoodcategory');
    // this.Topbar.ngOnInit();
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
        this.loadNeighbourhoodCategorysList();
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
        this.loadNeighbourhoodCategorysList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new NeighbourhoodCategorysDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {

      this.NeighbourhoodCategorysResult = res;
      if (res.length > 0) {
        this.NeighbourhoodCategorysResult = [];
        if (this.CompanyID == "0" && this.LocationID == "0")
          this.NeighbourhoodCategorysResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //   this.NeighbourhoodCategorysResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
           this.NeighbourhoodCategorysResult = res;
        if (this.NeighbourhoodCategorysResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.NeighbourhoodCategorysResult = [];
        this.length = true;
      }

      this.NeighbourhoodCategoryListData$.next(this.NeighbourhoodCategorysResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadNeighbourhoodCategorysList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load NeighbourhoodCategorys List
   */
  loadNeighbourhoodCategorysList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new NeighbourhoodCategorysPageRequested({ page: queryParams }));
    this.selection.clear();
  }

  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;    
    filter.id = searchText;
    filter.bedtype = searchText;    
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete NeighbourhoodCategory
   *
   * @param _item: NeighbourhoodCategory
   */
  deleteNeighbourhoodCategory(_item: NeighbourhoodCategoryModel) {

    const _title: string = 'NeighbourhoodCategory Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this NeighbourhoodCategory?';
    const _waitDesciption: string = 'NeighbourhoodCategory is deleting...';
    const _deleteMessage = `NeighbourhoodCategory has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteNeighbourhoodCategory(_item.id).subscribe(data => {
          console.log('NeighbourhoodCategory Deteleted conformationreceived: ' + data)
          this.store.dispatch(new NeighbourhoodCategoryDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadNeighbourhoodCategorysList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchNeighbourhoodCategorys() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.neighbourhoodcategory},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // NeighbourhoodCategory: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add NeighbourhoodCategory
   */
  addNeighbourhoodCategory() {
    const newNeighbourhoodCategory = new NeighbourhoodCategoryModel();
    newNeighbourhoodCategory.clear(); // Set all defaults fields
    this.editNeighbourhoodCategory(newNeighbourhoodCategory);
  }

  /**
   * Edit NeighbourhoodCategory
   *
   * @param NeighbourhoodCategory: NeighbourhoodCategory
   */
  editNeighbourhoodCategory(NeighbourhoodCategory: NeighbourhoodCategoryModel) {
    
    const _saveMessage = `NeighbourhoodCategory successfully has been saved.`;
    const _messageType = NeighbourhoodCategory.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(NeighbourhoodcategoryeditComponent, { data: { id: NeighbourhoodCategory.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadNeighbourhoodCategorysList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.NeighbourhoodCategorysResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.NeighbourhoodCategorysResult.length) {
      this.selection.clear();
    } else {
      this.NeighbourhoodCategorysResult.forEach(row => this.selection.select(row));
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


