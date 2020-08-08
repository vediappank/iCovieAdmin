import { Menus } from '../../core/auth/_models/MAdministrator/menus.model';
import { SubMenu } from '../../core/auth/_models/MAdministrator/sub-menu.model';
import { AuthService } from '../../core/auth';
import { JsonPipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';

export class MenuConfig {
	
	//public defaults: any;

	constructor(private auth: AuthService) {
		
		//alert('first');
		// this.auth.GetAllMainMenu().subscribe((_mainMenus: Menus[]) => {
		// 	this.mainmenulist = _mainMenus;
		// 	this.auth.GetAllSubMenu().subscribe((_submenus: SubMenu[]) => {
		// 		
		// 		this.submenulist = _submenus;
		// 		alert()
		// 		//console.log("main Menu List :::::" + JSON.parse(this.mainmenulist.toString()));
		// 		//console.log("Sub Menu List :::::" + JSON.parse(this.submenulist.toString()));
		// 		this.tMainData = '';
		// 		for (let i = 0; i < this.mainmenulist.length; i++) {
		// 			this.tMainData += '{';
		// 			this.tMainData += "\"title\":\"" + this.mainmenulist[i].main_menu_name + "\",";
		// 			this.tMainData += "\"root\":\"true\",";
		// 			this.tMainData += "\"alignment\":\"left\",";
		// 			this.tMainData += "\"page\":\"" + this.mainmenulist[i].main_menu_path + "\",";
		// 			this.tMainData += "\"translate\":\"MENU.DASHBOARD\",";
		// this.tSubData = '';
		// this.Filtersubmenulist = this.submenulist.filter(u =>
		// 	u.main_menu_id === this.mainmenulist[i].main_menu_id
		// )
		// if (this.Filtersubmenulist.length > 0) {
		// 	this.tMainData += "\"toggle\":\"click\",";
		// 	this.tSubData += "\"submenu\":[";
		// 	for (let j = 0; j < this.Filtersubmenulist.length; j++) {
		// 		this.tSubData += "{";
		// 		this.tSubData += "\"title\":\"" + this.Filtersubmenulist[j].sub_menu_name + "\",";
		// 		this.tSubData += "\"page\":\"" + this.Filtersubmenulist[j].sub_menu_path + "\",";
		// 		this.tSubData += "\"bullet\":\"dot\",";
		// 		this.tSubData += "\"icon\":\"flaticon-interface-7\"";
		// 		if (this.Filtersubmenulist.length - 1 == j)
		// 			this.tSubData += '}'
		// 		else
		// 			this.tSubData += '},'
		// 	}
		// 	this.tSubData += "]";
		// 	if (this.tSubData != undefined && this.tSubData != '')
		// 		this.tMainData += this.tSubData;
		// 	if (this.mainmenulist.length - 1 == i)
		// 		this.tMainData += '}'
		// 	else
		// 		this.tMainData += '},'
		// }
		// else
		// 	this.tMainData += '},'
		// }

		// console.log("main Menu Tree :::::" + this.tMainData);

		
		// try {
		// 	//data = JSON.parse("self:{},items:[{title:Dashboards,root:true,alignment:left,page:/dashboard,translate:DASHBOARD}]") as JSON[];
		// 	//data = JSON.parse('{}');
		// 	//let datastring1 = "header:{self:'{}',items:[{title:'Dashboards',root:true,alignment:'left','page':'/dashboard','translate':'DASHBOARD'}]'}";
		// 	
		// 	 this.datastring = '{"title":"Dashboards","icon": "flaticon2-architecture-and-city","root":"true","alignment":"left","page":"/dashboard","translate":"DASHBOARD"}';
		// 	console.log('this.defaults- function::::' + this.datastring);
		// 	this.data = JSON.parse(this.datastring);
		// 	console.log('this.defaults- function::::' + JSON.stringify(this.data));
		// 	//
		// 	this.defaults = {				
		// 		header: {
		// 			self: {},
		// 			items: [
		// 				this.datastring
		// 			]
		// 		},
		// 		aside: {
		// 			self: {},
		// 			items: [
		// 				this.datastring
		// 			]
		// 		}
		// 	}
		// 	alert('datastring json data::::' + JSON.parse(this.datastring));
		// }
		// catch (e) {

		// 	alert(e.message + 'json data::::' + JSON.parse(this.datastring));
		// 	// here you would get the same "unable to parse json <" error above
		// 	return;
		// }
		//alert('first - 1');
		//	});
		//});
	}

	public get configs(): Observable<any> {
		//alert('second');
		//console.log('this.defaults vedi::::' +  JSON.stringify(this.defaults) );
		//return this.defaults;
		
		console.log('Inside Menu Config GetConfig method');
		return this.auth.GetMenuConfig();
		// return this.auth.GetMenuConfig().subscribe(config => {
		// 	console.log('this.defaults vedi::::' +  JSON.stringify(config) );
		// 	
		// 	return config;
		// });
	}
}
