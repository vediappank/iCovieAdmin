
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { NeighbourhoodCategoryModel } from '../../_models/Masters/NeighbourhoodCategory.model';

export enum NeighbourhoodCategoryActionTypes {
    AllNeighbourhoodCategorysRequested = '[NeighbourhoodCategorys Home Page] All NeighbourhoodCategorys Requested',
    AllNeighbourhoodCategorysLoaded = '[NeighbourhoodCategorys API] All NeighbourhoodCategorys Loaded',
    NeighbourhoodCategoryOnServerCreated = '[Edit NeighbourhoodCategory Dialog] NeighbourhoodCategory On Server Created',
    NeighbourhoodCategoryCreated = '[Edit NeighbourhoodCategorys Dialog] NeighbourhoodCategorys Created',
    NeighbourhoodCategoryUpdated = '[Edit NeighbourhoodCategory Dialog] NeighbourhoodCategory Updated',
    NeighbourhoodCategoryDeleted = '[NeighbourhoodCategorys List Page] NeighbourhoodCategory Deleted',
    NeighbourhoodCategorysPageRequested = '[NeighbourhoodCategorys List Page] NeighbourhoodCategorys Page Requested',
    NeighbourhoodCategorysPageLoaded = '[NeighbourhoodCategorys API] NeighbourhoodCategorys Page Loaded',
    NeighbourhoodCategorysPageCancelled = '[NeighbourhoodCategorys API] NeighbourhoodCategorys Page Cancelled',
    NeighbourhoodCategorysPageToggleLoading = '[NeighbourhoodCategorys page] NeighbourhoodCategorys Page Toggle Loading',
    NeighbourhoodCategorysActionToggleLoading = '[NeighbourhoodCategorys] NeighbourhoodCategorys Action Toggle Loading'
}

export class NeighbourhoodCategoryOnServerCreated implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryOnServerCreated;
    constructor(public payload: { NeighbourhoodCategory: NeighbourhoodCategoryModel }) { }
}

export class NeighbourhoodCategoryCreated implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryCreated;
    constructor(public payload: { NeighbourhoodCategory: NeighbourhoodCategoryModel }) { }
}

export class NeighbourhoodCategoryUpdated implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryUpdated;
    constructor(public payload: {
        partialNeighbourhoodCategory: Update<NeighbourhoodCategoryModel>,
        NeighbourhoodCategory: NeighbourhoodCategoryModel
    }) { }
}

export class NeighbourhoodCategoryDeleted implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryDeleted;
    constructor(public payload: { id: number }) {}
}

export class NeighbourhoodCategorysPageRequested implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class NeighbourhoodCategorysPageLoaded implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageLoaded;
    constructor(public payload: { NeighbourhoodCategorys: NeighbourhoodCategoryModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class NeighbourhoodCategorysPageCancelled implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageCancelled;
}

export class AllNeighbourhoodCategorysRequested implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.AllNeighbourhoodCategorysRequested;
}

export class AllNeighbourhoodCategorysLoaded implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.AllNeighbourhoodCategorysLoaded;
    constructor(public payload: { NeighbourhoodCategorys: NeighbourhoodCategoryModel[] }) { }
}

export class NeighbourhoodCategorysPageToggleLoading implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class NeighbourhoodCategorysActionToggleLoading implements Action {
    readonly type = NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type NeighbourhoodCategoryActions = NeighbourhoodCategoryCreated
| NeighbourhoodCategoryUpdated
| NeighbourhoodCategoryDeleted
| NeighbourhoodCategorysPageRequested
| NeighbourhoodCategorysPageLoaded
| NeighbourhoodCategorysPageCancelled
| AllNeighbourhoodCategorysLoaded
| AllNeighbourhoodCategorysRequested
| NeighbourhoodCategoryOnServerCreated
| NeighbourhoodCategorysPageToggleLoading
| NeighbourhoodCategorysActionToggleLoading;

