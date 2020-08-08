import { BaseModel } from '../../../_base/crud';

export class MApproverModel extends BaseModel {
    repStartDate: number;  
    repEndDate:number;
    locationid:number[];  
    companyid:string;
    
    clear(): void {
        this.repEndDate= undefined;
        this.repStartDate=undefined;
        this.locationid   = undefined;
        this.companyid= undefined;
       
	}
}

