

export class GuestTypeModel {
    id: number;    
    guesttype:string;   
    cid:number; 
    isCore: boolean = false;    
    clear(): void {
        this.id= undefined;
        this.guesttype= '';        
        this.cid = undefined;      
        this.isCore=false;
	}
}

