import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-administratorlist',
  templateUrl: './administratorlist.component.html',
  styleUrls: ['./administratorlist.component.scss']
})
export class AdministratorlistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getComponentTitle() {
		let result = 'Role / User Settings';	
		return result;
  }
  
}
