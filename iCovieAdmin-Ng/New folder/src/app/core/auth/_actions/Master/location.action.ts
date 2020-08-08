// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MLocationModel } from '../../_models/MFacilities/mlocation.model';

export enum LocationActionTypes {
    AllLocationsRequested = '[Locations Home Page] All Locations Requested',
    AllLocationsLoaded = '[Locations API] All Locations Loaded',
    LocationOnServerCreated = '[Edit Location Dialog] Location On Server Created',
    LocationCreated = '[Edit Locations Dialog] Locations Created',
    LocationUpdated = '[Edit Location Dialog] Location Updated',
    LocationDeleted = '[Locations List Page] Location Deleted',
    LocationsPageRequested = '[Locations List Page] Locations Page Requested',
    LocationsPageLoaded = '[Locations API] Locations Page Loaded',
    LocationsPageCancelled = '[Locations API] Locations Page Cancelled',
    LocationsPageToggleLoading = '[Locations page] Locations Page Toggle Loading',
    LocationsActionToggleLoading = '[Locations] Locations Action Toggle Loading'
}

export class LocationOnServerCreated implements Action {
    readonly type = LocationActionTypes.LocationOnServerCreated;
    constructor(public payload: { Location: MLocationModel }) { }
}

export class LocationCreated implements Action {
    readonly type = LocationActionTypes.LocationCreated;
    constructor(public payload: { Location: MLocationModel }) { }
}

export class LocationUpdated implements Action {
    readonly type = LocationActionTypes.LocationUpdated;
    constructor(public payload: {
        partialLocation: Update<MLocationModel>,
        Location: MLocationModel
    }) { }
}

export class LocationDeleted implements Action {
    readonly type = LocationActionTypes.LocationDeleted;
    constructor(public payload: { id: number }) {}
}

export class LocationsPageRequested implements Action {
    readonly type = LocationActionTypes.LocationsPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class LocationsPageLoaded implements Action {
    readonly type = LocationActionTypes.LocationsPageLoaded;
    constructor(public payload: { Locations: MLocationModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class LocationsPageCancelled implements Action {
    readonly type = LocationActionTypes.LocationsPageCancelled;
}

export class AllLocationsRequested implements Action {
    readonly type = LocationActionTypes.AllLocationsRequested;
}

export class AllLocationsLoaded implements Action {
    readonly type = LocationActionTypes.AllLocationsLoaded;
    constructor(public payload: { Locations: MLocationModel[] }) { }
}

export class LocationsPageToggleLoading implements Action {
    readonly type = LocationActionTypes.LocationsPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class LocationsActionToggleLoading implements Action {
    readonly type = LocationActionTypes.LocationsActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type LocationActions = LocationCreated
| LocationUpdated
| LocationDeleted
| LocationsPageRequested
| LocationsPageLoaded
| LocationsPageCancelled
| AllLocationsLoaded
| AllLocationsRequested
| LocationOnServerCreated
| LocationsPageToggleLoading
| LocationsActionToggleLoading;
