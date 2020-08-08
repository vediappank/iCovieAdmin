

export class AminitiesNeighbourhoodModel {
    id: number;    
    aminitiestypeid:number;   
    aminitiesNeighbourhood:string;   
    
    cid:number; 
    isCoreCategory: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.aminitiestypeid= undefined;
        
        this.aminitiesNeighbourhood ='';       
        this.cid = undefined;      
        this.isCoreCategory=false;
	}
}

