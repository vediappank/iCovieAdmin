

export class BedTypeModel {
    id: number;    
    bedtype:string;   
    
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.bedtype= '';    
              
        this.cid = undefined;      
        this.isCore=false;
	}
}

