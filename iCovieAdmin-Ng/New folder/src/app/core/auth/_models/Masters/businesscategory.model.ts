

export class BusinessCategoryModel {
    id: number;    
    businesscategory:string;
    shortname:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.businesscategory= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

