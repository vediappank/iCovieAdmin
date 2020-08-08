import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth';
import { User } from '../../../core/auth/_models/MAdministrator/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kt-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  public userCollection: User;
  public userid: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public callcenter: string;
  public userccrolename: string;
  public profile_img:any;
  constructor(public auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    this.getUserInformation();
  }

  getUserInformation() {
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.auth.getUserById(Number(this.userid)).subscribe((_userlist: User) => {
        this.userCollection = _userlist;
      // 
        if (this.userCollection) {
          this.firstname = this.userCollection[0].firstname;
          this.lastname = this.userCollection[0].lastname;
          this.email = this.userCollection[0].email;
          this.callcenter = this.userCollection[0].callcenter;
          this.userccrolename = this.userCollection[0].userccrolename;
          this.profile_img = this.userCollection[0].profile_img;
        }
      });
    }
  }
  pageuserprofileredirect() {

    this.router.navigate(['../userprofile/profileoverview'], { relativeTo: this.activatedRoute });
  }

  pagechangepasswordredirect() {
    this.router.navigate(['../userprofile/changepassword'], { relativeTo: this.activatedRoute });
  }
}
