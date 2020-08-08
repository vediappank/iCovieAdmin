// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MBuildingModel } from '../../_models/MFacilities/mbuilding.model';

export enum BuildingActionTypes {
    AllBuildingsRequested = '[Buildings Home Page] All Buildings Requested',
    AllBuildingsLoaded = '[Buildings API] All Buildings Loaded',
    BuildingOnServerCreated = '[Edit Building Dialog] Building On Server Created',
    BuildingCreated = '[Edit Buildings Dialog] Buildings Created',
    BuildingUpdated = '[Edit Building Dialog] Building Updated',
    BuildingDeleted = '[Buildings List Page] Building Deleted',
    BuildingsPageRequested = '[Buildings List Page] Buildings Page Requested',
    BuildingsPageLoaded = '[Buildings API] Buildings Page Loaded',
    BuildingsPageCancelled = '[Buildings API] Buildings Page Cancelled',
    BuildingsPageToggleLoading = '[Buildings page] Buildings Page Toggle Loading',
    BuildingsActionToggleLoading = '[Buildings] Buildings Action Toggle Loading'
}

export class BuildingOnServerCreated implements Action {
    readonly type = BuildingActionTypes.BuildingOnServerCreated;
    constructor(public payload: { Building: MBuildingModel }) { }
}

export class BuildingCreated implements Action {
    readonly type = BuildingActionTypes.BuildingCreated;
    constructor(public payload: { Building: MBuildingModel }) { }
}

export class BuildingUpdated implements Action {
    readonly type = BuildingActionTypes.BuildingUpdated;
    constructor(public payload: {
        partialBuilding: Update<MBuildingModel>,
        Building: MBuildingModel
    }) { }
}

export class BuildingDeleted implements Action {
    readonly type = BuildingActionTypes.BuildingDeleted;
    constructor(public payload: { id: number }) {}
}

export class BuildingsPageRequested implements Action {
    readonly type = BuildingActionTypes.BuildingsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class BuildingsPageLoaded implements Action {
    readonly type = BuildingActionTypes.BuildingsPageLoaded;
    constructor(public payload: { Buildings: MBuildingModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class BuildingsPageCancelled implements Action {
    readonly type = BuildingActionTypes.BuildingsPageCancelled;
}

export class AllBuildingsRequested implements Action {
    readonly type = BuildingActionTypes.AllBuildingsRequested;
}

export class AllBuildingsLoaded implements Action {
    readonly type = BuildingActionTypes.AllBuildingsLoaded;
    constructor(public payload: { Buildings: MBuildingModel[] }) { }
}

export class BuildingsPageToggleLoading implements Action {
    readonly type = BuildingActionTypes.BuildingsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class BuildingsActionToggleLoading implements Action {
    readonly type = BuildingActionTypes.BuildingsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type BuildingActions = BuildingCreated
| BuildingUpdated
| BuildingDeleted
| BuildingsPageRequested
| BuildingsPageLoaded
| BuildingsPageCancelled
| AllBuildingsLoaded
| AllBuildingsRequested
| BuildingOnServerCreated
| BuildingsPageToggleLoading
| BuildingsActionToggleLoading;
