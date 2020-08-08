// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MRegionModel } from '../../_models/MGeograpical/mRegion.model';

export enum RegionActionTypes {
    AllRegionsRequested = '[Regions Home Page] All Regions Requested',
    AllRegionsLoaded = '[Regions API] All Regions Loaded',
    RegionOnServerCreated = '[Edit Region Dialog] Region On Server Created',
    RegionCreated = '[Edit Regions Dialog] Regions Created',
    RegionUpdated = '[Edit Region Dialog] Region Updated',
    RegionDeleted = '[Regions List Page] Region Deleted',
    RegionsPageRequested = '[Regions List Page] Regions Page Requested',
    RegionsPageLoaded = '[Regions API] Regions Page Loaded',
    RegionsPageCancelled = '[Regions API] Regions Page Cancelled',
    RegionsPageToggleLoading = '[Regions page] Regions Page Toggle Loading',
    RegionsActionToggleLoading = '[Regions] Regions Action Toggle Loading'
}

export class RegionOnServerCreated implements Action {
    readonly type = RegionActionTypes.RegionOnServerCreated;
    constructor(public payload: { Region: MRegionModel }) { }
}

export class RegionCreated implements Action {
    readonly type = RegionActionTypes.RegionCreated;
    constructor(public payload: { Region: MRegionModel }) { }
}

export class RegionUpdated implements Action {
    readonly type = RegionActionTypes.RegionUpdated;
    constructor(public payload: {
        partialRegion: Update<MRegionModel>,
        Region: MRegionModel
    }) { }
}

export class RegionDeleted implements Action {
    readonly type = RegionActionTypes.RegionDeleted;
    constructor(public payload: { id: number }) {}
}

export class RegionsPageRequested implements Action {
    readonly type = RegionActionTypes.RegionsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class RegionsPageLoaded implements Action {
    readonly type = RegionActionTypes.RegionsPageLoaded;
    constructor(public payload: { Regions: MRegionModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class RegionsPageCancelled implements Action {
    readonly type = RegionActionTypes.RegionsPageCancelled;
}

export class AllRegionsRequested implements Action {
    readonly type = RegionActionTypes.AllRegionsRequested;
}

export class AllRegionsLoaded implements Action {
    readonly type = RegionActionTypes.AllRegionsLoaded;
    constructor(public payload: { Regions: MRegionModel[] }) { }
}

export class RegionsPageToggleLoading implements Action {
    readonly type = RegionActionTypes.RegionsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class RegionsActionToggleLoading implements Action {
    readonly type = RegionActionTypes.RegionsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type RegionActions = RegionCreated
| RegionUpdated
| RegionDeleted
| RegionsPageRequested
| RegionsPageLoaded
| RegionsPageCancelled
| AllRegionsLoaded
| AllRegionsRequested
| RegionOnServerCreated
| RegionsPageToggleLoading
| RegionsActionToggleLoading;
