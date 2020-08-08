import { BaseModel } from '../../../_base/crud';

export class MBuildingModel extends BaseModel {
    id: number;  
    companyname:string;
    locationname:string;
    buildingname:string;
    shortname:string;
    cuid:number;
    companyid:number;
    companyids:number[];  
	 locationid:number;
    locationids:number[]; 
    isactive: boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.companyname= '';
        this.locationname= '';
        this.buildingname= '';
        this.shortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.isactive=true;
        this.isCore=false;
        this.companyids = undefined;
		 this.locationids = undefined;
		  this.locationids = undefined;
    	}
}

