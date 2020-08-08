// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MFloorModel } from '../../_models/MFacilities/mfloor.model';

export enum FloorActionTypes {
    AllFloorsRequested = '[Floors Home Page] All Floors Requested',
    AllFloorsLoaded = '[Floors API] All Floors Loaded',
    FloorOnServerCreated = '[Edit Floor Dialog] Floor On Server Created',
    FloorCreated = '[Edit Floors Dialog] Floors Created',
    FloorUpdated = '[Edit Floor Dialog] Floor Updated',
    FloorDeleted = '[Floors List Page] Floor Deleted',
    FloorsPageRequested = '[Floors List Page] Floors Page Requested',
    FloorsPageLoaded = '[Floors API] Floors Page Loaded',
    FloorsPageCancelled = '[Floors API] Floors Page Cancelled',
    FloorsPageToggleLoading = '[Floors page] Floors Page Toggle Loading',
    FloorsActionToggleLoading = '[Floors] Floors Action Toggle Loading'
}

export class FloorOnServerCreated implements Action {
    readonly type = FloorActionTypes.FloorOnServerCreated;
    constructor(public payload: { Floor: MFloorModel }) { }
}

export class FloorCreated implements Action {
    readonly type = FloorActionTypes.FloorCreated;
    constructor(public payload: { Floor: MFloorModel }) { }
}

export class FloorUpdated implements Action {
    readonly type = FloorActionTypes.FloorUpdated;
    constructor(public payload: {
        partialFloor: Update<MFloorModel>,
        Floor: MFloorModel
    }) { }
}

export class FloorDeleted implements Action {
    readonly type = FloorActionTypes.FloorDeleted;
    constructor(public payload: { id: number }) {}
}

export class FloorsPageRequested implements Action {
    readonly type = FloorActionTypes.FloorsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class FloorsPageLoaded implements Action {
    readonly type = FloorActionTypes.FloorsPageLoaded;
    constructor(public payload: { Floors: MFloorModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class FloorsPageCancelled implements Action {
    readonly type = FloorActionTypes.FloorsPageCancelled;
}

export class AllFloorsRequested implements Action {
    readonly type = FloorActionTypes.AllFloorsRequested;
}

export class AllFloorsLoaded implements Action {
    readonly type = FloorActionTypes.AllFloorsLoaded;
    constructor(public payload: { Floors: MFloorModel[] }) { }
}

export class FloorsPageToggleLoading implements Action {
    readonly type = FloorActionTypes.FloorsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class FloorsActionToggleLoading implements Action {
    readonly type = FloorActionTypes.FloorsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type FloorActions = FloorCreated
| FloorUpdated
| FloorDeleted
| FloorsPageRequested
| FloorsPageLoaded
| FloorsPageCancelled
| AllFloorsLoaded
| AllFloorsRequested
| FloorOnServerCreated
| FloorsPageToggleLoading
| FloorsActionToggleLoading;
