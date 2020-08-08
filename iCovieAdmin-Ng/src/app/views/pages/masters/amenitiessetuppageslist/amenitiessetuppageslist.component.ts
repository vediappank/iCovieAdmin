import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-amenitiessetuppageslist',
  templateUrl: './amenitiessetuppageslist.component.html',
  styleUrls: ['./amenitiessetuppageslist.component.scss']
})
export class AmenitiessetuppageslistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getComponentTitle() {
		let result = 'Amenities Settings';	
		return result;
  }

}
