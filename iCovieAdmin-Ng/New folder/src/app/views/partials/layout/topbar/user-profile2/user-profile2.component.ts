// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { currentUser, User, isUserLoaded, getLoggedInUser } from '../../../../../core/auth';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import * as Reducers from '../../../../../core/auth/_reducers';
import { AuthActions } from '../../../../../core/auth/_actions';
import { AuthNoticeService, AuthService } from '../../../../../core/auth';
import { debug } from 'webpack';

@Component({
  selector: 'kt-user-profile2',
  templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {

  selectedCompany: string;
  selectedLocation: string;

  public defaultCompanys = [];
  public AdmindefaultCompanys = [];

  public defaultLocations =[] =[];
  public filterLocations =[];

  // Public properties
  user$: Observable<User>;
  luser: User;

  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;
  companyid: number;
  locationid : number;
  isadmin: string;
  public userlist: User;
  public fullname: string;
  public Username: string;
  public profileImg: any;
  ngZone: any;
  public currentURL: string;
  public adminurl:string;
  role_name: any;
  issuperadmin: string;
  /**
   * Component constructor
   *
   * @param store: Store<AppState>
   */
  constructor(private store: Store<Reducers.State>, private router: Router, private auth: AuthService) {
    //alert(this.router.url);
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void { 
  
    this.currentURL = this.router.url.split('/')[1]; 
    if (localStorage.hasOwnProperty('currentUser')) {
      this.companyid = JSON.parse(localStorage.getItem('currentUser')).companyid;
      this.locationid = JSON.parse(localStorage.getItem('currentUser')).locationid;
      this.isadmin = JSON.parse(localStorage.getItem('currentUser')).isadmin;
      this.issuperadmin = JSON.parse(localStorage.getItem('currentUser')).issuperadmin;
      this.fullname = JSON.parse(localStorage.getItem('currentUser')).fullName;
      this.role_name = JSON.parse(localStorage.getItem('currentUser')).role_name;
      this.defaultCompanys = JSON.parse(localStorage.getItem('defaultcompanies'));
      this.defaultLocations = JSON.parse(localStorage.getItem('defaultlocations'));     
    }
    
     let getCompanyLocation = this.auth.getItems();
    if (getCompanyLocation.length > 0) {
      this.selectedCompany = getCompanyLocation[0].CompanyID.toString();
      let locationchangeflag = localStorage.getItem('locationChangeFlag');
     // if( locationchangeflag != "1")
      let getCompanyLocation1 = this.auth.getItems();
      this.selectedLocation = getCompanyLocation1[0].LocationID.toString();      
    }
    else
    {
      this.selectedCompany = JSON.parse(localStorage.getItem('currentUser')).companyid;
      this.selectedLocation = JSON.parse(localStorage.getItem('currentUser')).locationid;
      
    }
    this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
    this.getLocationByCompany();

    console.log('Company Location One Time Configuration::: Company' + this.selectedCompany + 'Location:::' + this.selectedLocation);
    this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
    this.luser = JSON.parse(localStorage.getItem('currentUser'));
    //this.profileImg = this.luser.profile_img; 
    this.profileImg = './assets/media/users/300_21.jpg';
  }

 
  onChangeComapny() {  
       
    localStorage.setItem('locationChangeFlag', "0");  
    console.log('Location Changes::: Company:::' + this.selectedCompany + ',Location:::' + this.selectedLocation);
    this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
    localStorage.setItem('SelectedCompanyID',this.selectedCompany);  
    this.getLocationByCompany();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }
  onChangeLocation() { 
  
    localStorage.setItem('locationChangeFlag',"1");  
    console.log('Location Changes::: Company:::' + this.selectedCompany + ',Location:::' + this.selectedLocation);
    this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  getLocationByCompany() {   
    
    this.defaultLocations=[];	
    this.defaultLocations = JSON.parse(localStorage.getItem('defaultlocations'));
   
    //this.auth.GetALLLocation().subscribe(_locationList => {
      if (this.isadmin == "True") {
        this.selectedLocation = "0";
        this.defaultLocations.push({ id: 0, locationname: "ALL" }); 
        if(this.defaultLocations.length >0)
        {
         if(this.selectedCompany != "0")
          this.defaultLocations = this.defaultLocations.filter(row=>row.companyid == this.selectedCompany);            
        }                
      }
     else if (this.issuperadmin == "True") {
        this.selectedLocation = "0";
        this.defaultLocations.push({ id: 0, locationname: "ALL" }); 
        if(this.defaultLocations.length >0)
        {
         if(this.selectedCompany != "0")
          this.defaultLocations = this.defaultLocations.filter(row=>row.companyid == this.selectedCompany);;            
        }     
      }
      else {
        this.selectedLocation = this.locationid.toString(); 
        if( this.defaultLocations.length >0)
        {
          this.defaultLocations = this.defaultLocations.filter(row=>row.companyid == this.selectedCompany && row.id == this.locationid);
         
        }     
      }
      this.filterLocations =   this.defaultLocations; 
      if(this.selectedCompany == "0")
      this.selectedLocation ="0";
      else 
        this.selectedLocation = this.defaultLocations[0].id.toString(); 
      if(localStorage.getItem('locationChangeFlag') == "1")     
        this.selectedLocation = this.auth.getItems()[0].LocationID.toString(); 
      console.log('Getall Location Data Response Came::::' + JSON.stringify(this.defaultLocations));    
      this.auth.addItem({ 'CompanyID': this.selectedCompany, 'LocationID': this.selectedLocation });
   // localStorage.setItem('defaultlocations', JSON.stringify(this.defaultLocations));
   // });
  }

  pageredirect() {
    this.router.navigateByUrl('/userprofile');
  }

  /**
   * Log out
   */
  logout() {
    // this.store.complete();
   
    localStorage.clear();
   // this.store.dispatch(AuthActions.logout());
    
    this.router.navigateByUrl('/auth/login');
  }
}
