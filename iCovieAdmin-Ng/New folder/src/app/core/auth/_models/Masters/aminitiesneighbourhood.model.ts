

export class AminitiesNeighbourhoodModel {
    id: number;    
    neighbourhoodcategoryid:number;   
    neighbourhoodcategory:string;  
    neighbourhoodtype:string; 
    
    cid:number; 
    isCoreCategory: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.neighbourhoodcategoryid= undefined;        
        this.neighbourhoodcategory ='';  
        this.neighbourhoodtype ='';       
        this.cid = undefined;      
        this.isCoreCategory=false;
	}
}

