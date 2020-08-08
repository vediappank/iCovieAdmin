import { BaseModel } from '../../../_base/crud';

export class MLocationModel extends BaseModel {
    id: number;  
    companyname:string;
    locationname:string;
    shortname:string;
    cuid:number;
    companyid:number;
    companyids:number[];  
    isactive: boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.companyname= '';
        this.locationname= '';
        this.shortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.isactive=true;
        this.isCore=false;
        this.companyids = undefined;
    	}
}

