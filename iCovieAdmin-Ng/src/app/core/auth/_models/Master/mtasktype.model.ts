import { BaseModel } from '../../../_base/crud';

export class MTaskTypeModel extends BaseModel {
    id: number;      
    tasktypename:string;
    tasktypeshortname:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;        
        this.tasktypename= '';
        this.tasktypeshortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

