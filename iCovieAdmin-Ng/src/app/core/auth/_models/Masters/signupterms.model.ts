
export class SignupTermsModel {
    id: number;
    signupid: number;
    locationid: number;
    membershipid: string;
    first_name: string;
    lastn_ame: string;
    email_id: string;
    is_aggree_terms_doc: number;
    is_temp_memebership_created: number;
    is_pay_for_doc_verification: number;
   
    cid: number;
    isCoreCategory: boolean = false;
    clear(): void {
        this.id = undefined;
        
        this.signupid=undefined;
        this.locationid=undefined;
        this.membershipid='';
        this.first_name='';
        this.lastn_ame='';
        this.email_id='';
        this.is_aggree_terms_doc=undefined;
        this.is_temp_memebership_created=undefined;
        this.is_pay_for_doc_verification=undefined;
        
        this.cid = undefined;
        this.isCoreCategory = false;
    }
}

