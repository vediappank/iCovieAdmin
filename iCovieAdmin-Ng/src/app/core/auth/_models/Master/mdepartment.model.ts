import { BaseModel } from '../../../_base/crud';

export class MDepartmentModel extends BaseModel {
    id: number;    
    departmentname:string;
    departmentshortname:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCoredepartment: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.departmentname= '';
        this.departmentshortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCoredepartment=false;
	}
}

