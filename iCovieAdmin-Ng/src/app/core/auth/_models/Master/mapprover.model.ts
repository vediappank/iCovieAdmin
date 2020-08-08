import { BaseModel } from '../../../_base/crud';

export class MApproverModel extends BaseModel {
    id: number;  
    departmentid:number;
    departmentids:number[];  
    approvername:string;
    approvershortname:string;
    departmentname:string;
    designation:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.departmentid=undefined;
        this.designation   ='';
        this.approvername= '';
        this.approvershortname=  '';
        this.cuid = undefined;

        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

