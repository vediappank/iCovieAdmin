

export class MCountryModel  {
    id: number;  
    companyname:string;
    countryname:string;
    shortname:string;
    cid:number;
    companyid:number;    
    isactive: boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.companyname= '';
        this.countryname= '';
        this.shortname=  '';
        this.cid = undefined;
        this.companyid= undefined;
        this.isactive=true;
        this.isCore=false;
        
    	}
}

