import { BaseModel } from '../../../_base/crud';

export class WingTypeModel extends BaseModel {
    id: number;
    companyname: string;
    locationname: string;
    buildingname: string;
    floorname: string;
    unitsname: string;   
    companyid: number;    
    locationid: number;    
    buildingid: number;    
    floorid: number;
    unitsid: number;   
    unitstype:string;    
    cid:number;    
    isCore: boolean = false;
    
    clear(): void {
        this.id = undefined;
        this.companyname = '';
        this.unitsname = '';
        this.locationname = '';
        this.buildingname = '';
        this.floorname = '';
        this.unitstype='';
        this.companyid = undefined;
        this.isCore = false;
        this.companyid = undefined;
        this.locationid = undefined;        
        this.buildingid = undefined;        
        this.floorid = undefined;
        this.unitsid = undefined;
        this.isCore=false;
	}
}

