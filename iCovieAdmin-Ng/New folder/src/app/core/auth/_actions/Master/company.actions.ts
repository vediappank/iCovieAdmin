// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MCompanyModel } from '../../_models/MFacilities/mcompany.model';

export enum CompanyActionTypes {
    AllCompanysRequested = '[Companys Home Page] All Companys Requested',
    AllCompanysLoaded = '[Companys API] All Companys Loaded',
    CompanyOnServerCreated = '[Edit Company Dialog] Company On Server Created',
    CompanyCreated = '[Edit Companys Dialog] Companys Created',
    CompanyUpdated = '[Edit Company Dialog] Company Updated',
    CompanyDeleted = '[Companys List Page] Company Deleted',
    CompanysPageRequested = '[Companys List Page] Companys Page Requested',
    CompanysPageLoaded = '[Companys API] Companys Page Loaded',
    CompanysPageCancelled = '[Companys API] Companys Page Cancelled',
    CompanysPageToggleLoading = '[Companys page] Companys Page Toggle Loading',
    CompanysActionToggleLoading = '[Companys] Companys Action Toggle Loading'
}

export class CompanyOnServerCreated implements Action {
    readonly type = CompanyActionTypes.CompanyOnServerCreated;
    constructor(public payload: { Company: MCompanyModel }) { }
}

export class CompanyCreated implements Action {
    readonly type = CompanyActionTypes.CompanyCreated;
    constructor(public payload: { Company: MCompanyModel }) { }
}

export class CompanyUpdated implements Action {
    readonly type = CompanyActionTypes.CompanyUpdated;
    constructor(public payload: {
        partialCompany: Update<MCompanyModel>,
        Company: MCompanyModel
    }) { }
}

export class CompanyDeleted implements Action {
    readonly type = CompanyActionTypes.CompanyDeleted;
    constructor(public payload: { id: number }) {}
}

export class CompanysPageRequested implements Action {
    readonly type = CompanyActionTypes.CompanysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CompanysPageLoaded implements Action {
    readonly type = CompanyActionTypes.CompanysPageLoaded;
    constructor(public payload: { Companys: MCompanyModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class CompanysPageCancelled implements Action {
    readonly type = CompanyActionTypes.CompanysPageCancelled;
}

export class AllCompanysRequested implements Action {
    readonly type = CompanyActionTypes.AllCompanysRequested;
}

export class AllCompanysLoaded implements Action {
    readonly type = CompanyActionTypes.AllCompanysLoaded;
    constructor(public payload: { Companys: MCompanyModel[] }) { }
}

export class CompanysPageToggleLoading implements Action {
    readonly type = CompanyActionTypes.CompanysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CompanysActionToggleLoading implements Action {
    readonly type = CompanyActionTypes.CompanysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CompanyActions = CompanyCreated
| CompanyUpdated
| CompanyDeleted
| CompanysPageRequested
| CompanysPageLoaded
| CompanysPageCancelled
| AllCompanysLoaded
| AllCompanysRequested
| CompanyOnServerCreated
| CompanysPageToggleLoading
| CompanysActionToggleLoading;
