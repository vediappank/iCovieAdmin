

export class AminitiesModel {
    id: number;    
    aminities:string;   
    cid:number; 
    isCoreCategory: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.aminities= '';        
        this.cid = undefined;      
        this.isCoreCategory=false;
	}
}

