import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-propertysetuppageslist',
  templateUrl: './propertysetuppageslist.component.html',
  styleUrls: ['./propertysetuppageslist.component.scss']
})
export class PropertysetuppageslistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getComponentTitle() {
		let result = 'Property Settings';	
		return result;
  }

}
