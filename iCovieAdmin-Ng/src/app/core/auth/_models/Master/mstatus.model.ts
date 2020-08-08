

export class MStatusModel  {
    id: number;    
    statusname:string;
    statusshortname:string;
    colorcode:string;
    cuid:number;
    companyid:number;
    locationid:number;
    isCore: boolean = false;
    clear(): void {
        this.id= undefined;
        this.statusname= '';
        this.statusshortname=  '';
        this.colorcode ='';
        this.cuid = undefined;
        this.companyid= undefined;
        this.locationid= undefined;
        this.isCore=false;
	}
}

