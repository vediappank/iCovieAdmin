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
import { MCountryModel, CountrysDataSource, CountryDeleted, CountrysPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { countryeditcomponent } from '../countryedit/countryedit.component';
import { AuthService } from '../../../../../core/auth';

@Component({
  selector: 'kt-countrylist',
  templateUrl: './countrylist.component.html',
  styleUrls: ['./countrylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class countrylistcomponent implements OnInit {

  // Table fields
  public CountryInfo: MCountryModel[];
  public CountryListData$ = new BehaviorSubject<MCountryModel[]>(this.CountryInfo);
  dataSource: CountrysDataSource;
  displayedColumns = ['select','companyname', 'countryname', 'shortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MCountryModel>(true, []);
  public length: boolean = false;
  CountrysResult: MCountryModel[] = [];
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
    let getCompanyCountry = this.auth.getItems();
    this.CompanyID = getCompanyCountry[0].CompanyID;
    this.LocationID = getCompanyCountry[0].CountryID;
    console.log('Company Country One Time Configuration::: ' + JSON.stringify(getCompanyCountry));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Countrys'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('Countrys');
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
        this.loadCountrysList();
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
        this.loadCountrysList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new CountrysDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
    
      if (res.length > 0) {
        this.CountrysResult = [];
         if (this.CompanyID == "0" && this.LocationID == "0")
           this.CountrysResult = res;
        //  else if (this.CompanyID > 0 && this.LocationID > 0)
        //    this.CountrysResult = res.filter(row => row.companyid == Number(this.CompanyID));
         else
          this.CountrysResult = res;
        if (this.CountrysResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.CountrysResult = [];
        this.length = true;
      }

      this.CountryListData$.next(this.CountrysResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadCountrysList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Countrys List
   */
  loadCountrysList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new CountrysPageRequested({ page: queryParams }));
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
    // // filter.Countryid = this.CountryID; 
    //  filter.id = searchText;
    // filter.Countryname = searchText;
    // filter.Countryshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Countryname = searchText;
    //   filter.Countryshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.Countryid = this.CountryID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.Countryname = searchText;
    filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Country
   *
   * @param _item: Country
   */
  deleteCountry(_item: MCountryModel) {

    const _title: string = 'Country Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Country?';
    const _waitDesciption: string = 'Country is deleting...';
    const _deleteMessage = `Country has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteCountry(_item.id).subscribe(data => {
          console.log('Country Deteleted conformationreceived: ' + data)
          this.store.dispatch(new CountryDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadCountrysList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchCountrys() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.companyname},${elem.countryname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Country: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Country
   */
  addCountry() {
    const newCountry = new MCountryModel();
    newCountry.clear(); // Set all defaults fields
    this.editCountry(newCountry);
  }

  /**
   * Edit Country
   *
   * @param Country: Country
   */
  editCountry(Country: MCountryModel) {
    const _saveMessage = `Country successfully has been saved.`;
    const _messageType = Country.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(countryeditcomponent, { data: { id: Country.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadCountrysList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.CountrysResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.CountrysResult.length) {
      this.selection.clear();
    } else {
      this.CountrysResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.CountryID == "0") || (this.CompanyID == undefined && this.CountryID == undefined))
    //   return false;
    // else
      return true;
  }
}
