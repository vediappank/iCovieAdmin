
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { AminitiesTypeModel } from '../../_models/Masters/aminitiestype.model';

export enum AminitiesTypeActionTypes {
    AllAminitiesTypesRequested = '[AminitiesTypes Home Page] All AminitiesTypes Requested',
    AllAminitiesTypesLoaded = '[AminitiesTypes API] All AminitiesTypes Loaded',
    AminitiesTypeOnServerCreated = '[Edit AminitiesType Dialog] AminitiesType On Server Created',
    AminitiesTypeCreated = '[Edit AminitiesTypes Dialog] AminitiesTypes Created',
    AminitiesTypeUpdated = '[Edit AminitiesType Dialog] AminitiesType Updated',
    AminitiesTypeDeleted = '[AminitiesTypes List Page] AminitiesType Deleted',
    AminitiesTypesPageRequested = '[AminitiesTypes List Page] AminitiesTypes Page Requested',
    AminitiesTypesPageLoaded = '[AminitiesTypes API] AminitiesTypes Page Loaded',
    AminitiesTypesPageCancelled = '[AminitiesTypes API] AminitiesTypes Page Cancelled',
    AminitiesTypesPageToggleLoading = '[AminitiesTypes page] AminitiesTypes Page Toggle Loading',
    AminitiesTypesActionToggleLoading = '[AminitiesTypes] AminitiesTypes Action Toggle Loading'
}

export class AminitiesTypeOnServerCreated implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypeOnServerCreated;
    constructor(public payload: { AminitiesType: AminitiesTypeModel }) { }
}

export class AminitiesTypeCreated implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypeCreated;
    constructor(public payload: { AminitiesType: AminitiesTypeModel }) { }
}

export class AminitiesTypeUpdated implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypeUpdated;
    constructor(public payload: {
        partialAminitiesType: Update<AminitiesTypeModel>,
        AminitiesType: AminitiesTypeModel
    }) { }
}

export class AminitiesTypeDeleted implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypeDeleted;
    constructor(public payload: { id: number }) {}
}

export class AminitiesTypesPageRequested implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class AminitiesTypesPageLoaded implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypesPageLoaded;
    constructor(public payload: { AminitiesTypes: AminitiesTypeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class AminitiesTypesPageCancelled implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypesPageCancelled;
}

export class AllAminitiesTypesRequested implements Action {
    readonly type = AminitiesTypeActionTypes.AllAminitiesTypesRequested;
}

export class AllAminitiesTypesLoaded implements Action {
    readonly type = AminitiesTypeActionTypes.AllAminitiesTypesLoaded;
    constructor(public payload: { AminitiesTypes: AminitiesTypeModel[] }) { }
}

export class AminitiesTypesPageToggleLoading implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class AminitiesTypesActionToggleLoading implements Action {
    readonly type = AminitiesTypeActionTypes.AminitiesTypesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type AminitiesTypeActions = AminitiesTypeCreated
| AminitiesTypeUpdated
| AminitiesTypeDeleted
| AminitiesTypesPageRequested
| AminitiesTypesPageLoaded
| AminitiesTypesPageCancelled
| AllAminitiesTypesLoaded
| AllAminitiesTypesRequested
| AminitiesTypeOnServerCreated
| AminitiesTypesPageToggleLoading
| AminitiesTypesActionToggleLoading;

