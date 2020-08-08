import { BaseModel } from '../../../_base/crud';

export class MSubCategoryModel extends BaseModel {
    id: number;    
    categoryid: number; 
    categoryids: number[]; 
    subcategoryname:string;
    subcategoryshortname:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.categoryid= undefined;
        this.subcategoryname= '';
        this.subcategoryshortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

