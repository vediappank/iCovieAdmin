import { BaseModel } from '../../../_base/crud';

export class MCompanyModel extends BaseModel {
    id: number;  
    companyname:string;
    shortname:string;
    address1:string;
    address2:string;
    pincode:string;
    cityid:string;
    cityname:string;
    cid:number;
    isactive : boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.cityid= undefined;
        this.cityname= '';
        this.companyname= '';
        this.address1= '';
        this.address2= '';
        this.pincode= '';
        this.shortname=  '';
        this.cid = undefined;
        this.isactive = true;
        this.isCore=false;
	}
}

