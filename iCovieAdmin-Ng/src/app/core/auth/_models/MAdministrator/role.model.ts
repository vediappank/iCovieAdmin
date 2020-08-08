

export class Role {
    id: number;
    RoleName: string;
    RoleShortName: string;
    permissions: any[];
    //orgpermissions: any[];
    isCoreRole: boolean = false;
    privilegeid:number;
    mainmenuid:number;
    roleid:number;
    companyid:number;
    companyids:number[];
    companyname:string;
    locationid:number;
    locationids:number[];
    locationname:string;
    isadmin:boolean;   
    issuperadmin:boolean;   
    
    clear(): void {
        this.id = undefined;
        this.RoleName = '';
        this.RoleShortName = '';
        this.permissions = [];       
        this.isCoreRole = false;
        this.privilegeid=undefined;
        this.mainmenuid=undefined;
        this.roleid=undefined;
        this.isadmin=false;
        this.issuperadmin = false;
        this.companyid =undefined;
        this.companyname= '';
        this.locationid= undefined;
        this.locationname= '';
	}
}
