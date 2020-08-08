import { BaseModel } from '../../../_base/crud';

export class WingTypeModel extends BaseModel {
    id: number;    
    unitsid: number;     
    unitstypename:string;
    shortname:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.unitsid= undefined;
        this.unitstypename= '';
        this.shortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

