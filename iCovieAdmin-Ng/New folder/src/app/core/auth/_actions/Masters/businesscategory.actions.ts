
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { BusinessCategoryModel } from '../../_models/Masters/businesscategory.model';

export enum BusinessCategoryActionTypes {
    AllBusinessCategorysRequested = '[BusinessCategorys Home Page] All BusinessCategorys Requested',
    AllBusinessCategorysLoaded = '[BusinessCategorys API] All BusinessCategorys Loaded',
    BusinessCategoryOnServerCreated = '[Edit BusinessCategory Dialog] BusinessCategory On Server Created',
    BusinessCategoryCreated = '[Edit BusinessCategorys Dialog] BusinessCategorys Created',
    BusinessCategoryUpdated = '[Edit BusinessCategory Dialog] BusinessCategory Updated',
    BusinessCategoryDeleted = '[BusinessCategorys List Page] BusinessCategory Deleted',
    BusinessCategorysPageRequested = '[BusinessCategorys List Page] BusinessCategorys Page Requested',
    BusinessCategorysPageLoaded = '[BusinessCategorys API] BusinessCategorys Page Loaded',
    BusinessCategorysPageCancelled = '[BusinessCategorys API] BusinessCategorys Page Cancelled',
    BusinessCategorysPageToggleLoading = '[BusinessCategorys page] BusinessCategorys Page Toggle Loading',
    BusinessCategorysActionToggleLoading = '[BusinessCategorys] BusinessCategorys Action Toggle Loading'
}

export class BusinessCategoryOnServerCreated implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategoryOnServerCreated;
    constructor(public payload: { BusinessCategory: BusinessCategoryModel }) { }
}

export class BusinessCategoryCreated implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategoryCreated;
    constructor(public payload: { BusinessCategory: BusinessCategoryModel }) { }
}

export class BusinessCategoryUpdated implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategoryUpdated;
    constructor(public payload: {
        partialBusinessCategory: Update<BusinessCategoryModel>,
        BusinessCategory: BusinessCategoryModel
    }) { }
}

export class BusinessCategoryDeleted implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategoryDeleted;
    constructor(public payload: { id: number }) {}
}

export class BusinessCategorysPageRequested implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategorysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class BusinessCategorysPageLoaded implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategorysPageLoaded;
    constructor(public payload: { BusinessCategorys: BusinessCategoryModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class BusinessCategorysPageCancelled implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategorysPageCancelled;
}

export class AllBusinessCategorysRequested implements Action {
    readonly type = BusinessCategoryActionTypes.AllBusinessCategorysRequested;
}

export class AllBusinessCategorysLoaded implements Action {
    readonly type = BusinessCategoryActionTypes.AllBusinessCategorysLoaded;
    constructor(public payload: { BusinessCategorys: BusinessCategoryModel[] }) { }
}

export class BusinessCategorysPageToggleLoading implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategorysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class BusinessCategorysActionToggleLoading implements Action {
    readonly type = BusinessCategoryActionTypes.BusinessCategorysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type BusinessCategoryActions = BusinessCategoryCreated
| BusinessCategoryUpdated
| BusinessCategoryDeleted
| BusinessCategorysPageRequested
| BusinessCategorysPageLoaded
| BusinessCategorysPageCancelled
| AllBusinessCategorysLoaded
| AllBusinessCategorysRequested
| BusinessCategoryOnServerCreated
| BusinessCategorysPageToggleLoading
| BusinessCategorysActionToggleLoading;

