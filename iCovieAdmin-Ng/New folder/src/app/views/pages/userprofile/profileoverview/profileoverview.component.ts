import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth';
import { User } from '../../../../core/auth/_models/MAdministrator/user.model';


@Component({
  selector: 'kt-profileoverview',
  templateUrl: './profileoverview.component.html',
  styleUrls: ['./profileoverview.component.scss']
})
export class ProfileoverviewComponent implements OnInit {
  public userCollection: User;
  public userid: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public callcenter: string;
  public userccrolename: string;
public profile_img:any;
  constructor(public auth: AuthService) { }

  ngOnInit() {
    
    this.getUserInformation();
  }

  getUserInformation()
  {
    //
    if (localStorage.hasOwnProperty("currentUser")) {
      this.userid = JSON.parse(localStorage.getItem('currentUser')).agentid;
      this.auth.getUserById(Number(this.userid)).subscribe((_userlist: User) => {        
        this.userCollection = _userlist;        
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
}
