

export class GenderModel {
    id: number;    
    gender:string;   
    cid:number; 
    isCore: boolean = false;  

    clear(): void {
        this.id= undefined;
        this.gender= '';    
        this.cid = undefined;      
        this.isCore=false;
	}
}

