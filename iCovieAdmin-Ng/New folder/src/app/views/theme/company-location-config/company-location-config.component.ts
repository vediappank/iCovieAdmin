import { Component, OnInit } from '@angular/core';
import { AuthNoticeService, AuthService } from '../../../core/auth';

@Component({
  selector: 'kt-company-location-config',
  templateUrl: './company-location-config.component.html',
  styleUrls: ['./company-location-config.component.scss']
})
export class CompanyLocationConfigComponent implements OnInit {

  selectedCompany:string='CYBR'
  selectedLocation:string='LQBR'

  public defaultCompanys = [
    {
      id: 'CWBR',
      name: 'CWBR',
    }, {
      id: 'CMBR',
      name: 'CMBR',
    },
    {
      id: 'CQBR',
      name: 'CQBR',
    }
    ,
    {
      id: 'CYBR',
      name: 'CYBR',
    }
  ];

  public defaultLocations = [
    {
      id: 'LWBR',
      name: 'LWBR',
    }, {
      id: 'LMBR',
      name: 'LMBR',
    },
    {
      id: 'LQBR',
      name: 'LQBR',
    }
    ,
    {
      id: 'YBR',
      name: 'YBR',
    }
  ];
  constructor( private auth: AuthService) { 
    console.log('Con Service Message Add:::::');
    
    this.auth.addItem({'CompanyID':this.selectedCompany, 'Location':this.selectedLocation});
  }

  ngOnInit() {
    console.log('Service Message Add:::::');
    
    this.auth.addItem({'CompanyID':this.selectedCompany, 'Location':this.selectedLocation});
  }

}
