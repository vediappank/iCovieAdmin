

export class AminitiesModel {
    id: number;    
    aminities:string;   
    icon:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.aminities= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

