// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MWingModel } from '../../_models/MFacilities/mwing.model';
export enum WingActionTypes {
    AllWingsRequested = '[Wings Home Page] All Wings Requested',
    AllWingsLoaded = '[Wings API] All Wings Loaded',
    WingOnServerCreated = '[Edit Wing Dialog] Wing On Server Created',
    WingCreated = '[Edit Wings Dialog] Wings Created',
    WingUpdated = '[Edit Wing Dialog] Wing Updated',
    WingDeleted = '[Wings List Page] Wing Deleted',
    WingsPageRequested = '[Wings List Page] Wings Page Requested',
    WingsPageLoaded = '[Wings API] Wings Page Loaded',
    WingsPageCancelled = '[Wings API] Wings Page Cancelled',
    WingsPageToggleLoading = '[Wings page] Wings Page Toggle Loading',
    WingsActionToggleLoading = '[Wings] Wings Action Toggle Loading'
}

export class WingOnServerCreated implements Action {
    readonly type = WingActionTypes.WingOnServerCreated;
    constructor(public payload: { Wing: MWingModel }) { }
}

export class WingCreated implements Action {
    readonly type = WingActionTypes.WingCreated;
    constructor(public payload: { Wing: MWingModel }) { }
}

export class WingUpdated implements Action {
    readonly type = WingActionTypes.WingUpdated;
    constructor(public payload: {
        partialWing: Update<MWingModel>,
        Wing: MWingModel
    }) { }
}

export class WingDeleted implements Action {
    readonly type = WingActionTypes.WingDeleted;
    constructor(public payload: { id: number }) {}
}

export class WingsPageRequested implements Action {
    readonly type = WingActionTypes.WingsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class WingsPageLoaded implements Action {
    readonly type = WingActionTypes.WingsPageLoaded;
    constructor(public payload: { Wings: MWingModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class WingsPageCancelled implements Action {
    readonly type = WingActionTypes.WingsPageCancelled;
}

export class AllWingsRequested implements Action {
    readonly type = WingActionTypes.AllWingsRequested;
}

export class AllWingsLoaded implements Action {
    readonly type = WingActionTypes.AllWingsLoaded;
    constructor(public payload: { Wings: MWingModel[] }) { }
}

export class WingsPageToggleLoading implements Action {
    readonly type = WingActionTypes.WingsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class WingsActionToggleLoading implements Action {
    readonly type = WingActionTypes.WingsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type WingActions = WingCreated
| WingUpdated
| WingDeleted
| WingsPageRequested
| WingsPageLoaded
| WingsPageCancelled
| AllWingsLoaded
| AllWingsRequested
| WingOnServerCreated
| WingsPageToggleLoading
| WingsActionToggleLoading;
