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
import { MCityModel,CitysDataSource,  CityDeleted, CitysPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { cityeditcomponent } from '../cityedit/cityedit.component';
import { AuthService } from '../../../../../core/auth';
import { UserProfile2Component } from '../../../../partials/layout/topbar/user-profile2/user-profile2.component';
import { UserprofileComponent } from '../../../userprofile/userprofile.component';

@Component({
  selector: 'kt-Citylist',
  templateUrl: './Citylist.component.html',
  styleUrls: ['./Citylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitylistComponent implements OnInit {

  // Table fields
  public CityInfo: MCityModel[];
  public CityListData$ = new BehaviorSubject<MCityModel[]>(this.CityInfo);
  dataSource: CitysDataSource;
  displayedColumns = ['select','companyname','countryname','statename', 'cityname','shortname','timezonename', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // @ViewChild('currenturl', { static: true }) currenturl: UserProfile2Component;
  // Selection
  selection = new SelectionModel<MCityModel>(true, []);
  public length: boolean = false;
  CitysResult: MCityModel[] = [];
  public viewFlag: Boolean = false;
  public addFlag: Boolean = false;
  public editFlag: Boolean = false;
  public deleteFlag: Boolean = false;
  public visiblity : boolean = false;
  // Subscriptions
  private subscriptions: Subscription[] = [];
  countryID: any;
  stateID: any;

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
    // let getcountrystate = this.auth.getItems();
    // this.countryID = getcountrystate[0].countryID;
    // this.stateID = getcountrystate[0].stateID;
    // console.log('country state One Time Configuration::: ' + JSON.stringify(getcountrystate));
    this.countryID = JSON.parse(localStorage.getItem('currentUser')).countryid;
    this.stateID = JSON.parse(localStorage.getItem('currentUser')).stateid;

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Citys'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('Citys');
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
        this.loadCitysList();
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
        this.loadCitysList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new CitysDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {

      this.CitysResult = res;
      if (res.length > 0) {
        this.CitysResult = [];
        if (this.countryID == "0" && this.stateID == "0")
          this.CitysResult = res;
        //  else if (this.countryID > 0 && this.stateID > 0)
        //   this.CitysResult = res.filter(row => row.countryid == Number(this.countryID));
         else
           this.CitysResult = res;
        if (this.CitysResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.CitysResult = [];
        this.length = true;
      }

      this.CityListData$.next(this.CitysResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadCitysList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Citys List
   */
  loadCitysList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new CitysPageRequested({ page: queryParams }));
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
    //  filter.countryid = this.countryID;
    // // filter.stateid = this.stateID; 
    //  filter.id = searchText;
    // filter.cityname = searchText;
    // filter.Cityshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.cityname = searchText;
    //   filter.Cityshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.countryid = this.countryID;
    //  // filter.stateid = this.stateID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.cityname = searchText;
    filter.shortname = searchText;
    filter.countryname = searchText;
    filter.statename = searchText;
    filter.timezonename = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete City
   *
   * @param _item: City
   */
  deleteCity(_item: MCityModel) {

    const _title: string = 'City Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this City?';
    const _waitDesciption: string = 'City is deleting...';
    const _deleteMessage = `City has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteCity(_item.id).subscribe(data => {
          console.log('City Deteleted conformationreceived: ' + data)
          this.store.dispatch(new CityDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadCitysList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchCitys() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.cityname},${elem.statename},${elem.countryname},${elem.timezonename},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // City: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add City
   */
  addCity() {
    const newCity = new MCityModel();
    newCity.clear(); // Set all defaults fields
    this.editCity(newCity);
  }

  /**
   * Edit City
   *
   * @param City: City
   */
  editCity(City: MCityModel) {
    
    const _saveMessage = `City successfully has been saved.`;
    const _messageType = City.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(cityeditcomponent, { data: { id: City.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadCitysList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.CitysResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.CitysResult.length) {
      this.selection.clear();
    } else {
      this.CitysResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.countryID == "0" && this.stateID == "0") || (this.countryID == undefined && this.stateID == undefined))
    //   return false;
    // else
      return true;
  }
}
