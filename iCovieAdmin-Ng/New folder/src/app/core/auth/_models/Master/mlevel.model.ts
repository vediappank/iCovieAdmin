import { BaseModel } from '../../../_base/crud';

export class MLevelModel extends BaseModel {
    id: number;    
    levelname:string;
    levelshortname:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.levelname= '';
        this.levelshortname=  '';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

