

export class PropertyTypeModel {
    id: number;    
    propertytype:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.propertytype= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

