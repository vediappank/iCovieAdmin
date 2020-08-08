
export class SignupModel {
    id: number;
    companyid: number;
    locationid: number;
    membershipid: string;
    first_name: string;
    lastn_ame: string;
    email_id: string;
    is_submit_signed_doc: number;
    is_approve_memebership: number;
    is_notify_approval_email_sms: number;
   
    cid: number;
    isCoreCategory: boolean = false;
    clear(): void {
        this.id = undefined;
        
        this.companyid=undefined;
        this.locationid=undefined;
        this.membershipid='';
        this.first_name='';
        this.lastn_ame='';
        this.email_id='';
        this.is_submit_signed_doc=undefined;
        this.is_approve_memebership=undefined;
        this.is_notify_approval_email_sms=undefined;
        
        this.cid = undefined;
        this.isCoreCategory = false;
    }
}

