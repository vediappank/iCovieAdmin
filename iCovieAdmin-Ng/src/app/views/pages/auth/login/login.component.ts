// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, catchError } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';

import { privilege } from '../../../../core/auth/_models/privilege.model';
import { AuthActions } from '../../../../core/auth/_actions';
import { State } from '../../../../core/auth/_reducers/auth.reducers';


/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
  /*EMAIL: 'admin@demo.com',
  PASSWORD: 'demo'*/
  USERNAME: '',
  PASSWORD: ''
};

@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];
  menuCollection: Array<any> = [];
  privilegeCollection: Array<privilege> = [];
  private unsubscribe: Subject<any>;

  private returnUrl: any;


  selectedCompany: string;
  selectedLocation: string;
  companyid: number;
  locationid: number;
  isadmin: string;
  public defaultCompanys = [];
  public AdmindefaultCompanys = [];
  public defaultLocations = [];

  // public userlist: User;
  public fullname: string;
  public Username: string;
  public profileImg: any;
  issuperadmin: any;
  cityid: any;
  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  /**
   * Component constructor
   *
   * @param router: Router
   * @param auth: AuthService
   * @param authNoticeService: AuthNoticeService
   * @param translate: TranslateService
   * @param store: Store<AppState>
   * @param fb: FormBuilder
   * @param cdr: ChangeDetectorRef
   * @param route: ActivatedRoute
   */
  constructor(
    private router: Router,
    private auth: AuthService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store<State>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.unsubscribe = new Subject();

  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.initLoginForm();
    console.log('Con Service Message Add:::::');
    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      // alert('login comp');
      this.returnUrl = params['returnUrl'] || '/';
      // alert(this.returnUrl);

    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initLoginForm() {
    // demo message to show
    if (!this.authNoticeService.onNoticeChanged$.getValue()) {
      const initialNotice = `Use account
            <strong>${DEMO_PARAMS.USERNAME}</strong> and password
            <strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
      this.authNoticeService.setNotice(initialNotice, 'info');
    }

    this.loginForm = this.fb.group({
      username: [DEMO_PARAMS.USERNAME, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      password: [DEMO_PARAMS.PASSWORD, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }

  /**
   * Form Submit
   */
  submit() {
    
    localStorage.removeItem('SelectedCompanyID');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('defaultcompanies');
    localStorage.removeItem('defaultlocations');
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;
    const authData = {
      usename: controls['username'].value,
      password: controls['password'].value
    };

    this.auth
      .login(authData.usename, authData.password)
      .pipe(
        tap(user => { }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(
        user => {

          if (user) {
            const timeToLogin = Date.now() + 3600000; // 30 min           
            console.log('login userdetails::::' + JSON.stringify(user));
            localStorage.setItem('currentUser', JSON.stringify({
              fullName: user.username, agentid: user.id,
              token: user.access_token, email: user.email, expires_in: user.expires_in,
              TokenType: user.token_type, time_to_login: timeToLogin, role_id: user.roleid, role_name: user.role_name,
              refreshToken: user.refreshToken, profile_img: user.profile_img, stateid :user.stateid, cityid :user.cityid, companyid: user.companyid, locationid: user.locationid, isadmin: user.isadmin, issuperadmin: user.issuperadmin
            }));
            if (localStorage.hasOwnProperty('currentUser')) {
              console.log('Login Component localStorage :currentUser::: ' + JSON.stringify(localStorage.getItem('currentUser')));
            }

            this.store.dispatch(AuthActions.login({ authToken: user.access_token }));
            this.auth.getUserByToken().subscribe(users => {
              if (users) {
                localStorage.setItem('userLoggedIn', JSON.stringify(users[0]));
                this.store.dispatch(AuthActions.userLoaded({ user: users[0] }));
              }
            });
            this.companyid = JSON.parse(localStorage.getItem('currentUser')).companyid;
            this.cityid = JSON.parse(localStorage.getItem('currentUser')).cityid;
            this.locationid = JSON.parse(localStorage.getItem('currentUser')).locationid;
            this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
            this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
            this.getCompany(this.cityid);
            this.getLocationByCompany();
            this.auth.GetAllMainMenu(user.roleid).subscribe((_mainMenus: any) => {

              let isubmenucount: boolean;
              if (_mainMenus.length > 0) {
                this.menuCollection = _mainMenus;
                for (let i = 0; i < this.menuCollection.length; i++) {
                  if (i > 0) {
                    isubmenucount = _mainMenus[i].hasOwnProperty('submenu');
                    if (isubmenucount) {
                      for (let k = 0; k < this.menuCollection[i].submenu.length; k++) {
                        localStorage.setItem(this.menuCollection[i].submenu[k].title, this.menuCollection[i].submenu[k].privilegename);
                      }
                    }
                  } else {
                    localStorage.setItem(this.menuCollection[i].title, this.menuCollection[i].privilegename);
                  }
                }
                console.log('Login Successfull.. Navigating to :::' + this.returnUrl);
                this.router.navigateByUrl(this.returnUrl);
                // this.router.navigate([this.returnUrl]);
              }
            });

          } else {
            this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
          }
        },
        err => {
          this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
        }
      );
  }

  getCompany(cityID:number) {

    this.defaultCompanys = [];
    this.auth.GetALLCompany().subscribe(_companyList => {
      console.log('Getall Company Data Response Came::::' + JSON.stringify(_companyList));
      console.log('this.isadmin:::' + this.isadmin);
      if (this.isadmin == "True") {
        this.AdmindefaultCompanys.push({ id: 0, shortname: "ALL", companyname: "ALL" });      
        this.defaultCompanys.push(_companyList.find(row => row.id == this.companyid));
        this.selectedCompany =  this.defaultCompanys[0].id;
        this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': 0 });
        localStorage.setItem('defaultcompanies', JSON.stringify(this.defaultCompanys));
      }
      else if (this.issuperadmin == "True") {
        this.AdmindefaultCompanys.push({ id: 0, shortname: "ALL", companyname: "ALL" });      
        for (let i = 0; i < _companyList.length; i++) {
          this.AdmindefaultCompanys.push(_companyList[i]);
        }
        this.defaultCompanys = this.AdmindefaultCompanys;
        this.selectedCompany =  this.defaultCompanys[0].id;
        this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': 0 });
        localStorage.setItem('defaultcompanies', JSON.stringify(this.defaultCompanys));
      }
      else {
        this.selectedCompany = this.companyid.toString();
        this.defaultCompanys.push(_companyList.find(row => row.id == this.companyid));
        this.selectedCompany =  this.defaultCompanys[0].id;
        this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': 0 });
        localStorage.setItem('defaultcompanies', JSON.stringify(this.defaultCompanys));
      }

    });

  }

  getLocationByCompany() {
    
    this.defaultLocations = [];
    this.auth.GetALLLocation().subscribe(_locationList => {
      if (this.isadmin == "True") {
        this.selectedLocation = "0";
        this.defaultLocations.push({ id: 0, locationname: "ALL" });
        this.defaultLocations = _locationList;
      }
      else if (this.issuperadmin == "True") {
        this.selectedLocation = "0";
        this.defaultLocations.push({ id: 0, locationname: "ALL" });
        this.defaultLocations = _locationList;
      }
      else {
        this.selectedLocation = this.locationid.toString();
        this.defaultLocations = _locationList.filter(row => row.id == this.locationid && row.companyid == this.companyid );
        console.log('Getall Location Data Response Came::::' + JSON.stringify(this.defaultLocations));
        //this.defaultLocations = _locationList;
      }
      this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
      localStorage.setItem('defaultlocations', JSON.stringify(this.defaultLocations));
    });
  }
  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
