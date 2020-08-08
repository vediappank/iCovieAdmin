
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { BedTypeModel } from '../../_models/Masters/bedtype.model';

export enum BedTypeActionTypes {
    AllBedTypesRequested = '[BedTypes Home Page] All BedTypes Requested',
    AllBedTypesLoaded = '[BedTypes API] All BedTypes Loaded',
    BedTypeOnServerCreated = '[Edit BedType Dialog] BedType On Server Created',
    BedTypeCreated = '[Edit BedTypes Dialog] BedTypes Created',
    BedTypeUpdated = '[Edit BedType Dialog] BedType Updated',
    BedTypeDeleted = '[BedTypes List Page] BedType Deleted',
    BedTypesPageRequested = '[BedTypes List Page] BedTypes Page Requested',
    BedTypesPageLoaded = '[BedTypes API] BedTypes Page Loaded',
    BedTypesPageCancelled = '[BedTypes API] BedTypes Page Cancelled',
    BedTypesPageToggleLoading = '[BedTypes page] BedTypes Page Toggle Loading',
    BedTypesActionToggleLoading = '[BedTypes] BedTypes Action Toggle Loading'
}

export class BedTypeOnServerCreated implements Action {
    readonly type = BedTypeActionTypes.BedTypeOnServerCreated;
    constructor(public payload: { BedType: BedTypeModel }) { }
}

export class BedTypeCreated implements Action {
    readonly type = BedTypeActionTypes.BedTypeCreated;
    constructor(public payload: { BedType: BedTypeModel }) { }
}

export class BedTypeUpdated implements Action {
    readonly type = BedTypeActionTypes.BedTypeUpdated;
    constructor(public payload: {
        partialBedType: Update<BedTypeModel>,
        BedType: BedTypeModel
    }) { }
}

export class BedTypeDeleted implements Action {
    readonly type = BedTypeActionTypes.BedTypeDeleted;
    constructor(public payload: { id: number }) {}
}

export class BedTypesPageRequested implements Action {
    readonly type = BedTypeActionTypes.BedTypesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class BedTypesPageLoaded implements Action {
    readonly type = BedTypeActionTypes.BedTypesPageLoaded;
    constructor(public payload: { BedTypes: BedTypeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class BedTypesPageCancelled implements Action {
    readonly type = BedTypeActionTypes.BedTypesPageCancelled;
}

export class AllBedTypesRequested implements Action {
    readonly type = BedTypeActionTypes.AllBedTypesRequested;
}

export class AllBedTypesLoaded implements Action {
    readonly type = BedTypeActionTypes.AllBedTypesLoaded;
    constructor(public payload: { BedTypes: BedTypeModel[] }) { }
}

export class BedTypesPageToggleLoading implements Action {
    readonly type = BedTypeActionTypes.BedTypesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class BedTypesActionToggleLoading implements Action {
    readonly type = BedTypeActionTypes.BedTypesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type BedTypeActions = BedTypeCreated
| BedTypeUpdated
| BedTypeDeleted
| BedTypesPageRequested
| BedTypesPageLoaded
| BedTypesPageCancelled
| AllBedTypesLoaded
| AllBedTypesRequested
| BedTypeOnServerCreated
| BedTypesPageToggleLoading
| BedTypesActionToggleLoading;

