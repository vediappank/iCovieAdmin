// Angular
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {

	ngOnInit(): void {
		console.log('TopbarComponent Service Message Add:::::');
	}
 }
