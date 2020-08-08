
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
import { WingTypeModel,WingTypesDataSource, 
   WingTypeDeleted, WingTypesPageRequested }
  from '../../../../../core/auth';
import { AppState } from '../../../../../core/reducers';
import { QueryParamsModel } from '../../../../../core/_base/crud';
import { wingtypeeditcomponent } from '../wingtypeedit/wingtypeedit.component';
import { AuthService } from '../../../../../core/auth';
import { UserProfile2Component } from '../../../../partials/layout/topbar/user-profile2/user-profile2.component';
import { UserprofileComponent } from '../../../userprofile/userprofile.component';

@Component({
  selector: 'kt-wingtypelist',
  templateUrl: './wingtypelist.component.html',
  styleUrls: ['./wingtypelist.component.scss']
})
export class wingtypelistcomponent implements OnInit {
 // Table fields
 public WingTypeInfo: WingTypeModel[];
 public WingTypeListData$ = new BehaviorSubject<WingTypeModel[]>(this.WingTypeInfo);
 dataSource: WingTypesDataSource;
 displayedColumns = ['select','companyname','locationname','buildingname','floorname', 'unitsname', 'wingtype', 'actions'];
 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 @ViewChild('sort1', { static: true }) sort: MatSort;
 // Filter fields
 @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
 // @ViewChild('currenturl', { static: true }) currenturl: UserProfile2Component;
 // Selection
 selection = new SelectionModel<WingTypeModel>(true, []);
 public length: boolean = false;
 WingTypesResult: WingTypeModel[] = [];
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
   //alert(localStorage.getItem('Call Center WingTypes'));
   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   this.router.onSameUrlNavigation = 'reload';
   let value = localStorage.getItem('wingtypes');
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
       this.loadWingTypesList();
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
       this.loadWingTypesList();
     })
   )
     .subscribe();
   this.subscriptions.push(searchSubscription);

   // Init DataSource

   this.dataSource = new WingTypesDataSource(this.store);

   const entitiesSubscription = this.dataSource.entitySubject.pipe(
     skip(1),
     distinctUntilChanged()
   ).subscribe(res => {
debugger;
     this.WingTypesResult = res;
     if (res.length > 0) {
       this.WingTypesResult = [];
       if (this.CompanyID == "0" && this.LocationID == "0")
         this.WingTypesResult = res;
       //  else if (this.CompanyID > 0 && this.LocationID > 0)
       //   this.WingTypesResult = res.filter(row => row.companyid == Number(this.CompanyID));
        else
          this.WingTypesResult = res;
       if (this.WingTypesResult.length == 0)
         this.length = true;
       else
         this.length = false;
     }
     else {
       this.WingTypesResult = [];
       this.length = true;
     }

     this.WingTypeListData$.next(this.WingTypesResult);
   });
   this.subscriptions.push(entitiesSubscription);

   // First load
   of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
     this.loadWingTypesList();
   });

 }

 /**
  * On Destroy
  */
 ngOnDestroy() {
   this.subscriptions.forEach(el => el.unsubscribe());
 }

 /**
  * Load WingTypes List
  */
 loadWingTypesList() {

   this.selection.clear();
   const queryParams = new QueryParamsModel(
     this.filterConfiguration(),
     this.sort.direction,
     this.sort.active,
     this.paginator.pageIndex,
     this.paginator.pageSize
   );

   this.store.dispatch(new WingTypesPageRequested({ page: queryParams }));
   this.selection.clear();
 }

 /**
  * Returns object for filter
  */
 filterConfiguration(): any {
   
   const filter: any = {};
   const searchText: string = this.searchInput.nativeElement.value;   
   filter.id = searchText;
   filter.unitstype = searchText;
   filter.units = searchText;    
   return filter;

 }

 /** ACTIONS */
 /**
  * Delete WingType
  *
  * @param _item: WingType
  */
 deleteUnitsType(_item: WingTypeModel) {

   const _title: string = 'UnitsType Delete Confirmation?';
   const _description: string = 'Are you sure to permanently delete this UnitsType?';
   const _waitDesciption: string = 'UnitsType is deleting...';
   const _deleteMessage = `UnitsType has been deleted`;

   const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
   dialogRef.afterClosed().subscribe(res => {
     if (!res) {
       return;
     }
     else {
       this.auth.deleteWingType(_item.id).subscribe(data => {
         console.log('UnitsType Deteleted conformationreceived: ' + data)
         this.store.dispatch(new WingTypeDeleted({ id: _item.id }));
         this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
         this.loadWingTypesList();
       });
     }
   });
 }

 /** Fetch */
 /**
  * Fetch selected rows
  */
 fetchWingTypes() {
   const messages = [];
   this.selection.selected.forEach(elem => {
     messages.push({
       text: `${elem.unitstype},${elem.id}`,
       id: elem.id.toString(),
       // WingType: elem.username
     });
   });
   this.layoutUtilsService.fetchElements(messages);
 }

 /**
  * Add WingType
  */
 addUnitsType() {
   const newWingType = new WingTypeModel();
   newWingType.clear(); // Set all defaults fields
   this.editUnitsType(newWingType);
 }

 /**
  * Edit WingType
  *
  * @param WingType: WingType
  */
 editUnitsType(WingType: WingTypeModel) {
   
   const _saveMessage = `UnitsType successfully has been saved.`;
   const _messageType = WingType.id ? MessageType.Update : MessageType.Create;
   const dialogRef = this.dialog.open(wingtypeeditcomponent, { data: { id: WingType.id } });
   dialogRef.afterClosed().subscribe(res => {
     if (!res) {
       return;
     }

     this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 10000, true, true);
     this.loadWingTypesList();
   });
 }

 /**
  * Check all rows are selected
  */
 isAllSelected(): boolean {
   const numSelected = this.selection.selected.length;
   const numRows = this.WingTypesResult.length;
   return numSelected === numRows;
 }

 /**
  * Toggle selection
  */
 masterToggle() {
   if (this.selection.selected.length === this.WingTypesResult.length) {
     this.selection.clear();
   } else {
     this.WingTypesResult.forEach(row => this.selection.select(row));
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

