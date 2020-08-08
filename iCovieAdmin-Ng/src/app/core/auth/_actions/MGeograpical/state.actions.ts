// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MStateModel } from '../../_models/MGeograpical/mState.model';

export enum StateActionTypes {
    AllStatesRequested = '[States Home Page] All States Requested',
    AllStatesLoaded = '[States API] All States Loaded',
    StateOnServerCreated = '[Edit State Dialog] State On Server Created',
    StateCreated = '[Edit States Dialog] States Created',
    StateUpdated = '[Edit State Dialog] State Updated',
    StateDeleted = '[States List Page] State Deleted',
    StatesPageRequested = '[States List Page] States Page Requested',
    StatesPageLoaded = '[States API] States Page Loaded',
    StatesPageCancelled = '[States API] States Page Cancelled',
    StatesPageToggleLoading = '[States page] States Page Toggle Loading',
    StatesActionToggleLoading = '[States] States Action Toggle Loading'
}

export class StateOnServerCreated implements Action {
    readonly type = StateActionTypes.StateOnServerCreated;
    constructor(public payload: { State: MStateModel }) { }
}

export class StateCreated implements Action {
    readonly type = StateActionTypes.StateCreated;
    constructor(public payload: { State: MStateModel }) { }
}

export class StateUpdated implements Action {
    readonly type = StateActionTypes.StateUpdated;
    constructor(public payload: {
        partialState: Update<MStateModel>,
        State: MStateModel
    }) { }
}

export class StateDeleted implements Action {
    readonly type = StateActionTypes.StateDeleted;
    constructor(public payload: { id: number }) {}
}

export class StatesPageRequested implements Action {
    readonly type = StateActionTypes.StatesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class StatesPageLoaded implements Action {
    readonly type = StateActionTypes.StatesPageLoaded;
    constructor(public payload: { States: MStateModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class StatesPageCancelled implements Action {
    readonly type = StateActionTypes.StatesPageCancelled;
}

export class AllStatesRequested implements Action {
    readonly type = StateActionTypes.AllStatesRequested;
}

export class AllStatesLoaded implements Action {
    readonly type = StateActionTypes.AllStatesLoaded;
    constructor(public payload: { States: MStateModel[] }) { }
}

export class StatesPageToggleLoading implements Action {
    readonly type = StateActionTypes.StatesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class StatesActionToggleLoading implements Action {
    readonly type = StateActionTypes.StatesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type StateActions = StateCreated
| StateUpdated
| StateDeleted
| StatesPageRequested
| StatesPageLoaded
| StatesPageCancelled
| AllStatesLoaded
| AllStatesRequested
| StateOnServerCreated
| StatesPageToggleLoading
| StatesActionToggleLoading;
