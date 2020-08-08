
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { WingTypeModel } from '../../_models/Masters/wingtype.model';

export enum WingTypeActionTypes {
    AllWingTypesRequested = '[WingTypes Home Page] All WingTypes Requested',
    AllWingTypesLoaded = '[WingTypes API] All WingTypes Loaded',
    WingTypeOnServerCreated = '[Edit WingType Dialog] WingType On Server Created',
    WingTypeCreated = '[Edit WingTypes Dialog] WingTypes Created',
    WingTypeUpdated = '[Edit WingType Dialog] WingType Updated',
    WingTypeDeleted = '[WingTypes List Page] WingType Deleted',
    WingTypesPageRequested = '[WingTypes List Page] WingTypes Page Requested',
    WingTypesPageLoaded = '[WingTypes API] WingTypes Page Loaded',
    WingTypesPageCancelled = '[WingTypes API] WingTypes Page Cancelled',
    WingTypesPageToggleLoading = '[WingTypes page] WingTypes Page Toggle Loading',
    WingTypesActionToggleLoading = '[WingTypes] WingTypes Action Toggle Loading'
}

export class WingTypeOnServerCreated implements Action {
    readonly type = WingTypeActionTypes.WingTypeOnServerCreated;
    constructor(public payload: { WingType: WingTypeModel }) { }
}

export class WingTypeCreated implements Action {
    readonly type = WingTypeActionTypes.WingTypeCreated;
    constructor(public payload: { WingType: WingTypeModel }) { }
}

export class WingTypeUpdated implements Action {
    readonly type = WingTypeActionTypes.WingTypeUpdated;
    constructor(public payload: {
        partialWingType: Update<WingTypeModel>,
        WingType: WingTypeModel
    }) { }
}

export class WingTypeDeleted implements Action {
    readonly type = WingTypeActionTypes.WingTypeDeleted;
    constructor(public payload: { id: number }) {}
}

export class WingTypesPageRequested implements Action {
    readonly type = WingTypeActionTypes.WingTypesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class WingTypesPageLoaded implements Action {
    readonly type = WingTypeActionTypes.WingTypesPageLoaded;
    constructor(public payload: { WingTypes: WingTypeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class WingTypesPageCancelled implements Action {
    readonly type = WingTypeActionTypes.WingTypesPageCancelled;
}

export class AllWingTypesRequested implements Action {
    readonly type = WingTypeActionTypes.AllWingTypesRequested;
}

export class AllWingTypesLoaded implements Action {
    readonly type = WingTypeActionTypes.AllWingTypesLoaded;
    constructor(public payload: { WingTypes: WingTypeModel[] }) { }
}

export class WingTypesPageToggleLoading implements Action {
    readonly type = WingTypeActionTypes.WingTypesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class WingTypesActionToggleLoading implements Action {
    readonly type = WingTypeActionTypes.WingTypesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type WingTypeActions = WingTypeCreated
| WingTypeUpdated
| WingTypeDeleted
| WingTypesPageRequested
| WingTypesPageLoaded
| WingTypesPageCancelled
| AllWingTypesLoaded
| AllWingTypesRequested
| WingTypeOnServerCreated
| WingTypesPageToggleLoading
| WingTypesActionToggleLoading;

