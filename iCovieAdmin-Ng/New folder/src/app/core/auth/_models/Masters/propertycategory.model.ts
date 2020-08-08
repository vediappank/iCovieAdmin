

export class PropertyCategoryModel {
    id: number;    
    propertycategory:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.propertycategory= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

