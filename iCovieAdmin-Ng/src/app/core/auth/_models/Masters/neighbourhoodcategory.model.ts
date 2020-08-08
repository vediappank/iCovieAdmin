

export class NeighbourhoodCategoryModel {
    id: number;    
    neighbourhoodcategory:string;
    shortname:string;   
    icon:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.neighbourhoodcategory= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

