// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { MTimeZoneModel } from '../../_models/MGeograpical/mTimeZone.model';

export enum TimeZoneActionTypes {
    AllTimeZonesRequested = '[TimeZones Home Page] All TimeZones Requested',
    AllTimeZonesLoaded = '[TimeZones API] All TimeZones Loaded',
    TimeZoneOnServerCreated = '[Edit TimeZone Dialog] TimeZone On Server Created',
    TimeZoneCreated = '[Edit TimeZones Dialog] TimeZones Created',
    TimeZoneUpdated = '[Edit TimeZone Dialog] TimeZone Updated',
    TimeZoneDeleted = '[TimeZones List Page] TimeZone Deleted',
    TimeZonesPageRequested = '[TimeZones List Page] TimeZones Page Requested',
    TimeZonesPageLoaded = '[TimeZones API] TimeZones Page Loaded',
    TimeZonesPageCancelled = '[TimeZones API] TimeZones Page Cancelled',
    TimeZonesPageToggleLoading = '[TimeZones page] TimeZones Page Toggle Loading',
    TimeZonesActionToggleLoading = '[TimeZones] TimeZones Action Toggle Loading'
}

export class TimeZoneOnServerCreated implements Action {
    readonly type = TimeZoneActionTypes.TimeZoneOnServerCreated;
    constructor(public payload: { TimeZone: MTimeZoneModel }) { }
}

export class TimeZoneCreated implements Action {
    readonly type = TimeZoneActionTypes.TimeZoneCreated;
    constructor(public payload: { TimeZone: MTimeZoneModel }) { }
}

export class TimeZoneUpdated implements Action {
    readonly type = TimeZoneActionTypes.TimeZoneUpdated;
    constructor(public payload: {
        partialTimeZone: Update<MTimeZoneModel>,
        TimeZone: MTimeZoneModel
    }) { }
}

export class TimeZoneDeleted implements Action {
    readonly type = TimeZoneActionTypes.TimeZoneDeleted;
    constructor(public payload: { id: number }) {}
}

export class TimeZonesPageRequested implements Action {
    readonly type = TimeZoneActionTypes.TimeZonesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class TimeZonesPageLoaded implements Action {
    readonly type = TimeZoneActionTypes.TimeZonesPageLoaded;
    constructor(public payload: { TimeZones: MTimeZoneModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class TimeZonesPageCancelled implements Action {
    readonly type = TimeZoneActionTypes.TimeZonesPageCancelled;
}

export class AllTimeZonesRequested implements Action {
    readonly type = TimeZoneActionTypes.AllTimeZonesRequested;
}

export class AllTimeZonesLoaded implements Action {
    readonly type = TimeZoneActionTypes.AllTimeZonesLoaded;
    constructor(public payload: { TimeZones: MTimeZoneModel[] }) { }
}

export class TimeZonesPageToggleLoading implements Action {
    readonly type = TimeZoneActionTypes.TimeZonesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class TimeZonesActionToggleLoading implements Action {
    readonly type = TimeZoneActionTypes.TimeZonesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type TimeZoneActions = TimeZoneCreated
| TimeZoneUpdated
| TimeZoneDeleted
| TimeZonesPageRequested
| TimeZonesPageLoaded
| TimeZonesPageCancelled
| AllTimeZonesLoaded
| AllTimeZonesRequested
| TimeZoneOnServerCreated
| TimeZonesPageToggleLoading
| TimeZonesActionToggleLoading;
