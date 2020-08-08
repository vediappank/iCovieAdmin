import { BaseModel } from '../../../_base/crud';

export class MTimeZoneModel extends BaseModel {
    id: number;      
    timezone:string;
    
    cid:number;  
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;        
        this.timezone= '';
      
        this.cid = undefined;       
        this.isCore=false;
	}
}

