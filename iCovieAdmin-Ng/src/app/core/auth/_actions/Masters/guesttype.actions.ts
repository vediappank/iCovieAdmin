
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { GuestTypeModel } from '../../_models/Masters/guesttype.model';

export enum GuestTypeActionTypes {
    AllGuestTypesRequested = '[GuestTypes Home Page] All GuestTypes Requested',
    AllGuestTypesLoaded = '[GuestTypes API] All GuestTypes Loaded',
    GuestTypeOnServerCreated = '[Edit GuestType Dialog] GuestType On Server Created',
    GuestTypeCreated = '[Edit GuestTypes Dialog] GuestTypes Created',
    GuestTypeUpdated = '[Edit GuestType Dialog] GuestType Updated',
    GuestTypeDeleted = '[GuestTypes List Page] GuestType Deleted',
    GuestTypesPageRequested = '[GuestTypes List Page] GuestTypes Page Requested',
    GuestTypesPageLoaded = '[GuestTypes API] GuestTypes Page Loaded',
    GuestTypesPageCancelled = '[GuestTypes API] GuestTypes Page Cancelled',
    GuestTypesPageToggleLoading = '[GuestTypes page] GuestTypes Page Toggle Loading',
    GuestTypesActionToggleLoading = '[GuestTypes] GuestTypes Action Toggle Loading'
}

export class GuestTypeOnServerCreated implements Action {
    readonly type = GuestTypeActionTypes.GuestTypeOnServerCreated;
    constructor(public payload: { GuestType: GuestTypeModel }) { }
}

export class GuestTypeCreated implements Action {
    readonly type = GuestTypeActionTypes.GuestTypeCreated;
    constructor(public payload: { GuestType: GuestTypeModel }) { }
}

export class GuestTypeUpdated implements Action {
    readonly type = GuestTypeActionTypes.GuestTypeUpdated;
    constructor(public payload: {
        partialGuestType: Update<GuestTypeModel>,
        GuestType: GuestTypeModel
    }) { }
}

export class GuestTypeDeleted implements Action {
    readonly type = GuestTypeActionTypes.GuestTypeDeleted;
    constructor(public payload: { id: number }) {}
}

export class GuestTypesPageRequested implements Action {
    readonly type = GuestTypeActionTypes.GuestTypesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class GuestTypesPageLoaded implements Action {
    readonly type = GuestTypeActionTypes.GuestTypesPageLoaded;
    constructor(public payload: { GuestTypes: GuestTypeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class GuestTypesPageCancelled implements Action {
    readonly type = GuestTypeActionTypes.GuestTypesPageCancelled;
}

export class AllGuestTypesRequested implements Action {
    readonly type = GuestTypeActionTypes.AllGuestTypesRequested;
}

export class AllGuestTypesLoaded implements Action {
    readonly type = GuestTypeActionTypes.AllGuestTypesLoaded;
    constructor(public payload: { GuestTypes: GuestTypeModel[] }) { }
}

export class GuestTypesPageToggleLoading implements Action {
    readonly type = GuestTypeActionTypes.GuestTypesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class GuestTypesActionToggleLoading implements Action {
    readonly type = GuestTypeActionTypes.GuestTypesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type GuestTypeActions = GuestTypeCreated
| GuestTypeUpdated
| GuestTypeDeleted
| GuestTypesPageRequested
| GuestTypesPageLoaded
| GuestTypesPageCancelled
| AllGuestTypesLoaded
| AllGuestTypesRequested
| GuestTypeOnServerCreated
| GuestTypesPageToggleLoading
| GuestTypesActionToggleLoading;

