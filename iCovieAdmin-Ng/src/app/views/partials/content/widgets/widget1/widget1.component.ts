// Angular
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';

export interface Widget1Data {
	title: string;
	desc: string;
	value: string;
	valueClass?: string;
	popupIcon?: boolean;

}

@Component({
	selector: 'kt-widget1',
	templateUrl: './widget1.component.html',
	styleUrls: ['./widget1.component.scss']
})
export class Widget1Component implements OnInit {
	// Public properties
	@Input() data: Widget1Data[];
	public teamoragentdata: any[] = [];
	@Output() outputArray = new EventEmitter<string>();	
	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		console.log('Widget1Component data:::' + JSON.stringify(this.data));
		if (!this.data) {
			this.data = shuffle([
				{
					title: 'Member Profit',
					desc: 'Awerage Weekly Profit',
					value: '+$17,800',
					valueClass: 'kt-font-brand',
					popupIcon: false
				}, {
					title: 'Orders',
					desc: 'Weekly Customer Orders',
					value: '+$1,800',
					valueClass: 'kt-font-danger',
					popupIcon: false
				}, {
					title: 'Issue Reports',
					desc: 'System bugs and issues',
					value: '-27,49%',
					valueClass: 'kt-font-success',
					popupIcon: false
				}
			]);
		}


	}

	SendLabeltoParent(data: string) {
		this.outputArray.emit(data);
	}
	SendTeamActiontoParent(data: string, teamoragentdata: string) {
		//this.teamoragentdata = [{ LabelName: data, groupName: teamoragentdata }];
		let Label = data + ' By ' + teamoragentdata + ',' + teamoragentdata;
		console.log('SendTeamActiontoParent:::' + JSON.stringify(Label));
		const myObjStr = Label;
		this.outputArray.emit(myObjStr);
	}
	SendAgentActiontoParent(data: string, teamoragentdata: string) {
		//		this.teamoragentdata = [{ LabelName: data, groupName: teamoragentdata }];
		let Label = data + ' By ' + teamoragentdata + ',' + teamoragentdata;
		console.log('SendAgentActiontoParent:::' + JSON.stringify(Label));
		const myObjStr = Label;
		this.outputArray.emit(myObjStr);
	}
}
