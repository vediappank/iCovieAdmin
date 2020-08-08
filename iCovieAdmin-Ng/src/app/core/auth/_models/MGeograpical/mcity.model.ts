

export class MCityModel {
    id: number;
    countryid:number;
    countryname:string;
    stateid:number;
    companyid:number;
    statename:string;
    timezoneid:number;
    timezonename:String;
    cityname:string;
    companyname:string;
    cid:number;
    shortname:string;
    imagename:string;
    imagepath:string;
    showimagepath:string;
   
    isCoreCategory: boolean = false;
    
    clear(): void {
        this.id= undefined;
        this.countryid = undefined;
        this.countryname= '';
        this.stateid = undefined;
        this.companyid = undefined;
        this.statename= '';
        this.companyname= '';
        this.timezoneid = undefined;
        this.timezonename= '';
        this.shortname=  '';
        this.cid = undefined;
        this.cityname= '';       
        this.isCoreCategory=false;
        this.imagename='';
        this.imagepath='';
        this.showimagepath='';
	}
}

