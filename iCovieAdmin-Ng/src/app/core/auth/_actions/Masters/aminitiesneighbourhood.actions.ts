
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { AminitiesNeighbourhoodModel } from '../../_models/Masters/aminitiesneighbourhood.model';

export enum AminitiesNeighbourhoodActionTypes {
    AllAminitiesNeighbourhoodsRequested = '[AminitiesNeighbourhoods Home Page] All AminitiesNeighbourhoods Requested',
    AllAminitiesNeighbourhoodsLoaded = '[AminitiesNeighbourhoods API] All AminitiesNeighbourhoods Loaded',
    AminitiesNeighbourhoodOnServerCreated = '[Edit AminitiesNeighbourhood Dialog] AminitiesNeighbourhood On Server Created',
    AminitiesNeighbourhoodCreated = '[Edit AminitiesNeighbourhoods Dialog] AminitiesNeighbourhoods Created',
    AminitiesNeighbourhoodUpdated = '[Edit AminitiesNeighbourhood Dialog] AminitiesNeighbourhood Updated',
    AminitiesNeighbourhoodDeleted = '[AminitiesNeighbourhoods List Page] AminitiesNeighbourhood Deleted',
    AminitiesNeighbourhoodsPageRequested = '[AminitiesNeighbourhoods List Page] AminitiesNeighbourhoods Page Requested',
    AminitiesNeighbourhoodsPageLoaded = '[AminitiesNeighbourhoods API] AminitiesNeighbourhoods Page Loaded',
    AminitiesNeighbourhoodsPageCancelled = '[AminitiesNeighbourhoods API] AminitiesNeighbourhoods Page Cancelled',
    AminitiesNeighbourhoodsPageToggleLoading = '[AminitiesNeighbourhoods page] AminitiesNeighbourhoods Page Toggle Loading',
    AminitiesNeighbourhoodsActionToggleLoading = '[AminitiesNeighbourhoods] AminitiesNeighbourhoods Action Toggle Loading'
}

export class AminitiesNeighbourhoodOnServerCreated implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodOnServerCreated;
    constructor(public payload: { AminitiesNeighbourhood: AminitiesNeighbourhoodModel }) { }
}

export class AminitiesNeighbourhoodCreated implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodCreated;
    constructor(public payload: { AminitiesNeighbourhood: AminitiesNeighbourhoodModel }) { }
}

export class AminitiesNeighbourhoodUpdated implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodUpdated;
    constructor(public payload: {
        partialAminitiesNeighbourhood: Update<AminitiesNeighbourhoodModel>,
        AminitiesNeighbourhood: AminitiesNeighbourhoodModel
    }) { }
}

export class AminitiesNeighbourhoodDeleted implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodDeleted;
    constructor(public payload: { id: number }) {}
}

export class AminitiesNeighbourhoodsPageRequested implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class AminitiesNeighbourhoodsPageLoaded implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageLoaded;
    constructor(public payload: { AminitiesNeighbourhoods: AminitiesNeighbourhoodModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class AminitiesNeighbourhoodsPageCancelled implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageCancelled;
}

export class AllAminitiesNeighbourhoodsRequested implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AllAminitiesNeighbourhoodsRequested;
}

export class AllAminitiesNeighbourhoodsLoaded implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AllAminitiesNeighbourhoodsLoaded;
    constructor(public payload: { AminitiesNeighbourhoods: AminitiesNeighbourhoodModel[] }) { }
}

export class AminitiesNeighbourhoodsPageToggleLoading implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class AminitiesNeighbourhoodsActionToggleLoading implements Action {
    readonly type = AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type AminitiesNeighbourhoodActions = AminitiesNeighbourhoodCreated
| AminitiesNeighbourhoodUpdated
| AminitiesNeighbourhoodDeleted
| AminitiesNeighbourhoodsPageRequested
| AminitiesNeighbourhoodsPageLoaded
| AminitiesNeighbourhoodsPageCancelled
| AllAminitiesNeighbourhoodsLoaded
| AllAminitiesNeighbourhoodsRequested
| AminitiesNeighbourhoodOnServerCreated
| AminitiesNeighbourhoodsPageToggleLoading
| AminitiesNeighbourhoodsActionToggleLoading;

