

export class AminitiesTypeModel {
    id: number;    
    aminitiesid:number;   
    aminitiestype:string;   
    aminitiesimages:string;   
    cid:number; 
    isCoreCategory: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.aminitiesid= undefined;
        this.aminitiesimages =''; 
        this.aminitiestype ='';       
        this.cid = undefined;      
        this.isCoreCategory=false;
	}
}

