export class PageConfig {
	public defaults: any = {
		'dashboard': {
			page: {
				'title': 'Dashboard',
				'desc': 'Latest updates and statistic charts'
			},
			'ccratiodashboard': 
			{
				'title': 'Call Center Dashboard',	'desc': 'Call Center Dashboard'
			},
			'cbrdashboard': 
			{
				'title': 'Business Review Dashboard',	'desc': 'Business Review Dashboard'
			},
			'testdashboard': 
			{
				'title': 'Test Dashboard',	'desc': 'Test Dashboard'
			}		
		},			
		'user-management': {
			users: {
				page: {title: 'Users', desc: 'Users Informations'}
			},
			roles: {
				page: {title: 'Roles', desc: 'Roles Informations'}
			},
			company: {
				page: {title: 'Company List', desc: ''},
			},
			location: {
				page: {title: 'Location List', desc: ''},
			},
			building: {
				page: {title: 'Building List', desc: ''},
			},
			floor: {
				page: {title: 'Floor List', desc: ''},
			},
			wing: {
				page: {title: 'Wing List', desc: ''},
			},
			region: {
				page: {title: 'Region List', desc: ''},
			},
			country: {
				page: {title: 'Country List', desc: ''},
			},
			state: {
				page: {title: 'State List', desc: ''},
			},
			city: {
				page: {title: 'City List', desc: ''},
			},
			timezone: {
				page: {title: 'TimeZone List', desc: ''},
			},
			geographicslist: {
				page: {title: 'Geographical Settings', desc: 'Click each tab for more informations'},
			},
			commonpage: {
				page: {title: 'Facilities Settings', desc: 'Click each tab for more informations'},
			},
			administratorlist: {
				page: {title: 'Administrator Settings', desc: 'Click each tab for more informations'},
			}
							
		},
		'reports': {
			reports: {
				page: {title: 'Reports', desc: ''}
			},
			renovreports: {
				page: {title: 'Renovation Reports', desc: 'Renovation Reports Informations'}
			}
			
		},
		'masters': {
			aminities: {
				page: {title: 'Amenities Category List', desc: ''}
			},
			neighbourhoodtype: {
				page: {title: 'Neighbourhood Type List', desc: ''}
			},
			aminitiestype: {
				page: {title: 'Amenities Type List', desc: ''}
			},
			bedtype: {
				page: {title: 'Bed Type List', desc: ''}
			},
			businesscategory: {
				page: {title: 'Business Category List', desc: ''}
			},
			guesttype: {
				page: {title: 'Guest Type List', desc: ''}
			},
			property: {
				page: {title: 'Property List', desc: ''}
			},
			propertycategory: {
				page: {title: 'Property Category List', desc: ''}
			},
			propertytype: {
				page: {title: 'Property Type List', desc: 'Click each tab for more informations'},
			},
			signup: {
				page: {title: 'Signup List', desc: ''}
			},
			wingtype: {
				page: {title: 'Wing Type List' , desc: ''}
			},
			neighbourhoodcategory:{
				page: {title: 'Neighbourhood Category List', desc: 'Click each tab for more informations'}
			},
			neighbourhoodpagessettings:{
				page: {title: 'Neighbourhood Settings', desc: 'Click each tab for more informations'}
			},
			amenitiespagessettings:{
				page: {title: 'Amenities Settings', desc: 'Click each tab for more informations'}
			},
			propertypagessettings:{
				page: {title: 'Property Settings', desc: 'Click each tab for more informations'}
			},
					
					
		},
		'userprofile': {
			userprofile: {
				page: {title: 'User Profile', desc: 'User Profile'}
			},
			profileoverview: {
				page: {title: 'Profile Overview', desc: 'Profile Overview'}
			},
			ChangePassword: {
				page: {title: 'Change Password', desc: 'Change Password'}
			}			
		},
		builder: {
			page: {title: 'Layout Builder', desc: ''}
		},
		header: {
			actions: {
				page: {title: 'Actions', desc: 'Actions example page'}
			}
		},
		profile: {
			page: {title: 'User Profile', desc: ''}
		},
		error: {
			404: {
				page: {title: '404 Not Found', desc: '', subheader: false}
			},
			403: {
				page: {title: '403 Access Forbidden', desc: '', subheader: false}
			}
		},
		wizard: {
			'wizard-1': {page: {title: 'Wizard 1', desc: ''}},
			'wizard-2': {page: {title: 'Wizard 2', desc: ''}},
			'wizard-3': {page: {title: 'Wizard 3', desc: ''}},
			'wizard-4': {page: {title: 'Wizard 4', desc: ''}},
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
