
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
import { PropertyModel,PropertysDataSource,  PropertyDeleted, PropertysPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { PropertyeditComponent } from '../propertyedit/propertyedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-propertylist',
  templateUrl: './propertylist.component.html',
  styleUrls: ['./propertylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertylistComponent implements OnInit {

  // Table fields
  
  public PropertyInfo: PropertyModel[];
  public PropertyListData$ = new BehaviorSubject<PropertyModel[]>(this.PropertyInfo);
  dataSource: PropertysDataSource;
  displayedColumns = ['select','buildingname','floorname', 
  'unitsname','property','address', 'pricing', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<PropertyModel>(true, []);
  public length: boolean = false;
  PropertysResult: PropertyModel[] = [];
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
    //alert(localStorage.getItem('Call Center Propertys'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    
    let value = localStorage.getItem('propertys');
    
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
        this.loadPropertysList();
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
        this.loadPropertysList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new PropertysDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      //this.PropertysResult = res;
      if (res.length > 0) {
      
        this.PropertysResult = [];
        if (this.CompanyID == "0" && this.LocationID == "0")
          this.PropertysResult = res;
          else if (this.CompanyID > 0 && this.LocationID > 0)
           this.PropertysResult = res.filter(row => row.companyid == Number(this.CompanyID) );
        else
         this.PropertysResult = res;
        if (this.PropertysResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.PropertysResult = [];
        this.length = true;
      }

      this.PropertyListData$.next(this.PropertysResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadPropertysList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Propertys List
   */
  loadPropertysList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new PropertysPageRequested({ page: queryParams }));
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
    // filter.Propertyname = searchText;
    // filter.Propertyshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Propertyname = searchText;
    //   filter.Propertyshortname = searchText;
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
    filter.propertyname = searchText;
    filter.shortname = searchText;
    filter.companyname = searchText;
    filter.locationname = searchText;
    filter.buildingname = searchText;
    filter.floorname = searchText;

    filter.bedtypename = searchText;
    filter.businesscategoryname = searchText;
    filter.guesttypename = searchText;
    filter.propertycategoryname = searchText;
    filter.propertytypename = searchText;
    filter.propertyname = searchText;

    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Property
   *
   * @param _item: Property
   */
  deleteProperty(_item: PropertyModel) {

    const _title: string = 'Property Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Property?';
    const _waitDesciption: string = 'Property is deleting...';
    const _deleteMessage = `Property has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteProperty(_item.id).subscribe(data => {
          console.log('Property Deteleted conformationreceived: ' + data)
          this.store.dispatch(new PropertyDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadPropertysList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchPropertys() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.description},${elem.address},${elem.id}`,

        id: elem.id.toString(),
        // Property: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Property
   */
  addProperty() {
    const newProperty = new PropertyModel();
    newProperty.clear(); // Set all defaults fields
    this.editProperty(newProperty);
  }

  /**
   * Edit Property
   *
   * @param Property: Property
   */
  editProperty(Property: PropertyModel) {
    
    const _saveMessage = `Property successfully has been saved.`;
    const _messageType = Property.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(PropertyeditComponent, { data: { id: Property.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadPropertysList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.PropertysResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.PropertysResult.length) {
      this.selection.clear();
    } else {
      this.PropertysResult.forEach(row => this.selection.select(row));
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

