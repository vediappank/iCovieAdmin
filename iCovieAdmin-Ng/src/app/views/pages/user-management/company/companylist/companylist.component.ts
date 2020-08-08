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
import { MCompanyModel, CompanysDataSource, CompanyDeleted, CompanysPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';

import { CompanyeditComponent } from '../companyedit/companyedit.component';
import { AuthService } from '../../../../../core/auth';
import { debug } from 'webpack';

@Component({
  selector: 'kt-Companylist',
  templateUrl: './Companylist.component.html',
  styleUrls: ['./Companylist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanylistComponent implements OnInit {

  // Table fields
  public CompanyInfo: MCompanyModel[];
  public CompanyListData$ = new BehaviorSubject<MCompanyModel[]>(this.CompanyInfo);
  dataSource: CompanysDataSource;
  displayedColumns = ['select', 'Companyname', 'Companyshortname', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  // Selection
  selection = new SelectionModel<MCompanyModel>(true, []);
  public length: boolean = false;
  CompanysResult: MCompanyModel[] = [];
  public viewFlag: Boolean = false;
  public addFlag: Boolean = false;
  public editFlag: Boolean = false;
  public deleteFlag: Boolean = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];
  CompanyID: any;
 
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
    let getCompany = this.auth.getItems();
    this.CompanyID = getCompany[0].CompanyID;
    console.log('Company One Time Configuration::: ' + JSON.stringify(getCompany));

  }
  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit() {
    
    //PageWisePermission
    //alert(localStorage.getItem('Call Center Companys'));
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
    let value = localStorage.getItem('companys');
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
        this.loadCompanysList();
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
        this.loadCompanysList();
      })
    )
      .subscribe();
    this.subscriptions.push(searchSubscription);

    // Init DataSource

    this.dataSource = new CompanysDataSource(this.store);

    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      
      //this.CompanysResult = res;

       if (res.length > 0) {
         this.CompanysResult = [];
      // if (this.CompanyID == "0")
      //      this.CompanysResult = res;
      //  else if (this.CompanyID >0)
      //    this.CompanysResult = res.filter(row => row.id == this.CompanyID);
      //  else
           this.CompanysResult = res;
        if (this.CompanysResult.length == 0)
          this.length = true;
        else
          this.length = false;
      }
      else {
        this.CompanysResult = [];
        this.length = true;
       }

      // this.CompanyListData$.next(this.CompanysResult);
    });
    this.subscriptions.push(entitiesSubscription);

    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadCompanysList();
    });

  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Companys List
   */
  loadCompanysList() {

    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.store.dispatch(new CompanysPageRequested({ page: queryParams }));
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
    // // filter.Companyid = this.CompanyID; 
    //  filter.id = searchText;
    // filter.Companyname = searchText;
    // filter.Companyshortname = searchText;
    // filter.designation = searchText;
    // filter.departmentname = searchText;
    // }
    // else
    // {
    //   filter.id = searchText;
    //   filter.Companyname = searchText;
    //   filter.Companyshortname = searchText;
    //   filter.designation = searchText;
    //   filter.departmentname = searchText;
    // }  
    // return filter;
    const filter: any = {};
    const searchText: string = this.searchInput.nativeElement.value;
    // if(searchText=='')
    //  {
    //   filter.companyid = this.CompanyID;
    //  // filter.Companyid = this.CompanyID; 
    //   filter.id = searchText;
    //   filter.levelname = searchText;
    //   filter.levelshortname = searchText;   
    //  }
    //  else
    //  {
    filter.id = searchText;
    filter.companyname = searchText;
    filter.shortname = searchText;
    //}  
    return filter;

  }

  /** ACTIONS */
  /**
   * Delete Company
   *
   * @param _item: Company
   */
  deleteCompany(_item: MCompanyModel) {

    const _title: string = 'Company Delete Confirmation?';
    const _description: string = 'Are you sure to permanently delete this Company?';
    const _waitDesciption: string = 'Company is deleting...';
    const _deleteMessage = `Company has been deleted`;

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.auth.deleteCompany(_item.id).subscribe(data => {
          console.log('Company Deteleted conformationreceived: ' + data)
          this.store.dispatch(new CompanyDeleted({ id: _item.id }));
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
          this.loadCompanysList();
        });
      }
    });
  }

  /** Fetch */
  /**
   * Fetch selected rows
   */
  fetchCompanys() {
    const messages = [];
    this.selection.selected.forEach(elem => {
      messages.push({
        text: `${elem.isactive},${elem.companyname},${elem.shortname},${elem.id}`,
        id: elem.id.toString(),
        // Company: elem.username
      });
    });
    this.layoutUtilsService.fetchElements(messages);
  }

  /**
   * Add Company
   */
  addCompany() {
    const newCompany = new MCompanyModel();
    newCompany.clear(); // Set all defaults fields
    this.editCompany(newCompany);
  }

  /**
   * Edit Company
   *
   * @param Company: Company
   */
  editCompany(Company: MCompanyModel) {
   
    const _saveMessage = `Company successfully has been saved.`;
    const _messageType = Company.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(CompanyeditComponent, { data: { id: Company.id } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
      this.loadCompanysList();
    });
  }

  /**
   * Check all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.CompanysResult.length;
    return numSelected === numRows;
  }

  /**
   * Toggle selection
   */
  masterToggle() {
    if (this.selection.selected.length === this.CompanysResult.length) {
      this.selection.clear();
    } else {
      this.CompanysResult.forEach(row => this.selection.select(row));
    }
  }

  /** Hide Show Add new button */

  NewButtonHideShow(): boolean {
    // if ((this.CompanyID == "0" && this.CompanyID == "0") || (this.CompanyID == undefined && this.CompanyID == undefined))
    //   return false;
    // else
      return true;
  }
}
