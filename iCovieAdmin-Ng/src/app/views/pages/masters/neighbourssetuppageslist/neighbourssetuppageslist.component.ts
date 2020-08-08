import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-neighbourssetuppageslist',
  templateUrl: './neighbourssetuppageslist.component.html',
  styleUrls: ['./neighbourssetuppageslist.component.scss']
})
export class NeighbourssetuppageslistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getComponentTitle() {
		let result = 'Neighbour Settings';	
		return result;
  }

}
