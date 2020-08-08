

export class User {
    id: number;
    username: string;
    password: string;
    email: string;    
    expires_in: string;
    access_token: string;
    token_type:string;
    refreshToken: string;
    userroleid: number[];    
    usercompanyid: number[];
    userlocationid: number[];
    roleid: number;
    cityid: number;
    countryid: number;
    stateid: number;
    role_name: string;
    firstname: string;
    lastname: string; 
    contactno: string;
    companyid: number;
    locationid: number;
    isadmin: boolean;
    issuperadmin: boolean;
    profile_img:string; 
  
    confirmpassword:string;
    clear(): void {
        this.id = undefined;
        this.username = '';
        this.password = '';
        this.confirmpassword = '';
        this.email = '';
        this.userroleid = [];        
        this.firstname = '';
        this.lastname = '';  
        this.countryid = undefined;      
        this.contactno= '';  
        this.usercompanyid = [];
        this.userlocationid = [];       
        this.refreshToken = 'access-token-' + Math.random();  
        this.profile_img = '';        
    }
}





