import { BaseModel } from '../../../_base/crud';

export class MPriorityModel extends BaseModel {
    id: number;    
    priorityname:string;
    priorityshortname:string;
    colorcode:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    clear(): void {
        this.id= undefined;
        this.priorityname= '';
        this.priorityshortname=  '';
        this.colorcode ='';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

