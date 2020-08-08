

export class MStateModel  {
    id: number;  
    countryname:string;
    companyname:string;
    statename:string;
    shortname:string;
    cid:number;
    countryid:number;    
    companyid:number;    
    isactive: boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.countryname= '';
        this.companyname ='';
        this.statename= '';
        this.shortname=  '';
        this.cid = undefined;
        this.countryid= undefined;
        this.companyid = undefined;
        this.isactive=true;
        this.isCore=false;
        
    	}
}

