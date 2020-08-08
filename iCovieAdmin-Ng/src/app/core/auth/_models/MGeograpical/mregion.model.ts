

export class MRegionModel  {
    id: number;  
    countryname:string;
    regionname:string;
    shortname:string;
    cid:number;
    countryid:number;    
    isactive: boolean;
    isCore: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.countryname= '';
        this.regionname= '';
        this.shortname=  '';
        this.cid = undefined;
        this.countryid= undefined;
        this.isactive=true;
        this.isCore=false;
        
    	}
}

