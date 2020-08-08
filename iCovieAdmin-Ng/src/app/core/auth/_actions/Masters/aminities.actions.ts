// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { AminitiesModel } from '../../_models/Masters/aminities.model';

export enum AminitiesActionTypes {
    AllAminitiessRequested = '[Aminitiess Home Page] All Aminitiess Requested',
    AllAminitiessLoaded = '[Aminitiess API] All Aminitiess Loaded',
    AminitiesOnServerCreated = '[Edit Aminities Dialog] Aminities On Server Created',
    AminitiesCreated = '[Edit Aminitiess Dialog] Aminitiess Created',
    AminitiesUpdated = '[Edit Aminities Dialog] Aminities Updated',
    AminitiesDeleted = '[Aminitiess List Page] Aminities Deleted',
    AminitiessPageRequested = '[Aminitiess List Page] Aminitiess Page Requested',
    AminitiessPageLoaded = '[Aminitiess API] Aminitiess Page Loaded',
    AminitiessPageCancelled = '[Aminitiess API] Aminitiess Page Cancelled',
    AminitiessPageToggleLoading = '[Aminitiess page] Aminitiess Page Toggle Loading',
    AminitiessActionToggleLoading = '[Aminitiess] Aminitiess Action Toggle Loading'
}

export class AminitiesOnServerCreated implements Action {
    readonly type = AminitiesActionTypes.AminitiesOnServerCreated;
    constructor(public payload: { Aminities: AminitiesModel }) { }
}

export class AminitiesCreated implements Action {
    readonly type = AminitiesActionTypes.AminitiesCreated;
    constructor(public payload: { Aminities: AminitiesModel }) { }
}

export class AminitiesUpdated implements Action {
    readonly type = AminitiesActionTypes.AminitiesUpdated;
    constructor(public payload: {
        partialAminities: Update<AminitiesModel>,
        Aminities: AminitiesModel
    }) { }
}

export class AminitiesDeleted implements Action {
    readonly type = AminitiesActionTypes.AminitiesDeleted;
    constructor(public payload: { id: number }) {}
}

export class AminitiessPageRequested implements Action {
    readonly type = AminitiesActionTypes.AminitiessPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class AminitiessPageLoaded implements Action {
    readonly type = AminitiesActionTypes.AminitiessPageLoaded;
    constructor(public payload: { Aminitiess: AminitiesModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class AminitiessPageCancelled implements Action {
    readonly type = AminitiesActionTypes.AminitiessPageCancelled;
}

export class AllAminitiessRequested implements Action {
    readonly type = AminitiesActionTypes.AllAminitiessRequested;
}

export class AllAminitiessLoaded implements Action {
    readonly type = AminitiesActionTypes.AllAminitiessLoaded;
    constructor(public payload: { Aminitiess: AminitiesModel[] }) { }
}

export class AminitiessPageToggleLoading implements Action {
    readonly type = AminitiesActionTypes.AminitiessPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class AminitiessActionToggleLoading implements Action {
    readonly type = AminitiesActionTypes.AminitiessActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type AminitiesActions = AminitiesCreated
| AminitiesUpdated
| AminitiesDeleted
| AminitiessPageRequested
| AminitiessPageLoaded
| AminitiessPageCancelled
| AllAminitiessLoaded
| AllAminitiessRequested
| AminitiesOnServerCreated
| AminitiessPageToggleLoading
| AminitiessActionToggleLoading;
