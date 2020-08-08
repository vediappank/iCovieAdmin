// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MCityModel } from '../../_models/MGeograpical/mcity.model';

export enum CityActionTypes {
    AllCitysRequested = '[Citys Home Page] All Citys Requested',
    AllCitysLoaded = '[Citys API] All Citys Loaded',
    CityOnServerCreated = '[Edit City Dialog] City On Server Created',
    CityCreated = '[Edit Citys Dialog] Citys Created',
    CityUpdated = '[Edit City Dialog] City Updated',
    CityDeleted = '[Citys List Page] City Deleted',
    CitysPageRequested = '[Citys List Page] Citys Page Requested',
    CitysPageLoaded = '[Citys API] Citys Page Loaded',
    CitysPageCancelled = '[Citys API] Citys Page Cancelled',
    CitysPageToggleLoading = '[Citys page] Citys Page Toggle Loading',
    CitysActionToggleLoading = '[Citys] Citys Action Toggle Loading'
}

export class CityOnServerCreated implements Action {
    readonly type = CityActionTypes.CityOnServerCreated;
    constructor(public payload: { City: MCityModel }) { }
}

export class CityCreated implements Action {
    readonly type = CityActionTypes.CityCreated;
    constructor(public payload: { City: MCityModel }) { }
}

export class CityUpdated implements Action {
    readonly type = CityActionTypes.CityUpdated;
    constructor(public payload: {
        partialCity: Update<MCityModel>,
        City: MCityModel
    }) { }
}

export class CityDeleted implements Action {
    readonly type = CityActionTypes.CityDeleted;
    constructor(public payload: { id: number }) {}
}

export class CitysPageRequested implements Action {
    readonly type = CityActionTypes.CitysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CitysPageLoaded implements Action {
    readonly type = CityActionTypes.CitysPageLoaded;
    constructor(public payload: { Citys: MCityModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class CitysPageCancelled implements Action {
    readonly type = CityActionTypes.CitysPageCancelled;
}

export class AllCitysRequested implements Action {
    readonly type = CityActionTypes.AllCitysRequested;
}

export class AllCitysLoaded implements Action {
    readonly type = CityActionTypes.AllCitysLoaded;
    constructor(public payload: { Citys: MCityModel[] }) { }
}

export class CitysPageToggleLoading implements Action {
    readonly type = CityActionTypes.CitysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CitysActionToggleLoading implements Action {
    readonly type = CityActionTypes.CitysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CityActions = CityCreated
| CityUpdated
| CityDeleted
| CitysPageRequested
| CitysPageLoaded
| CitysPageCancelled
| AllCitysLoaded
| AllCitysRequested
| CityOnServerCreated
| CitysPageToggleLoading
| CitysActionToggleLoading;
