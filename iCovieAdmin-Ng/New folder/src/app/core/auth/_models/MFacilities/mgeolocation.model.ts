import { BaseModel } from '../../../_base/crud';

export class MGeoLocationModel extends BaseModel {
    id: number;      
    geolocation:string;
    shortname:string;
    cuid:number;
    buildingid:number;
    buildingname:string;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;        
        this.geolocation= '';
        this.shortname=  '';
        this.cuid = undefined;
        this.buildingid= undefined;
        this.buildingname= '';
        this.isCore=false;
	}
}

