import { BaseModel } from '../../../_base/crud';

export class MVendorModel extends BaseModel {
    id: number;      
    vendorname:string;
    vendorshortname:string;
    contactno:string;
    email:string;
    address:string;
    officeno:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;        
        this.vendorname= '';
        this.vendorshortname=  '';
        this.contactno=  '';
        this.email=  '';
        this.address=  '';
        this.officeno=  '';
        this.cuid = undefined;

        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

