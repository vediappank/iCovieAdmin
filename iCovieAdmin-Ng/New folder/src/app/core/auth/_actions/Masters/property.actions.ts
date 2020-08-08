
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { PropertyModel } from '../../_models/Masters/property.model';

export enum PropertyActionTypes {
    AllPropertysRequested = '[Propertys Home Page] All Propertys Requested',
    AllPropertysLoaded = '[Propertys API] All Propertys Loaded',
    PropertyOnServerCreated = '[Edit Property Dialog] Property On Server Created',
    PropertyCreated = '[Edit Propertys Dialog] Propertys Created',
    PropertyUpdated = '[Edit Property Dialog] Property Updated',
    PropertyDeleted = '[Propertys List Page] Property Deleted',
    PropertysPageRequested = '[Propertys List Page] Propertys Page Requested',
    PropertysPageLoaded = '[Propertys API] Propertys Page Loaded',
    PropertysPageCancelled = '[Propertys API] Propertys Page Cancelled',
    PropertysPageToggleLoading = '[Propertys page] Propertys Page Toggle Loading',
    PropertysActionToggleLoading = '[Propertys] Propertys Action Toggle Loading'
}

export class PropertyOnServerCreated implements Action {
    readonly type = PropertyActionTypes.PropertyOnServerCreated;
    constructor(public payload: { Property: PropertyModel }) { }
}

export class PropertyCreated implements Action {
    readonly type = PropertyActionTypes.PropertyCreated;
    constructor(public payload: { Property: PropertyModel }) { }
}

export class PropertyUpdated implements Action {
    readonly type = PropertyActionTypes.PropertyUpdated;
    constructor(public payload: {
        partialProperty: Update<PropertyModel>,
        Property: PropertyModel
    }) { }
}

export class PropertyDeleted implements Action {
    readonly type = PropertyActionTypes.PropertyDeleted;
    constructor(public payload: { id: number }) {}
}

export class PropertysPageRequested implements Action {
    readonly type = PropertyActionTypes.PropertysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class PropertysPageLoaded implements Action {
    readonly type = PropertyActionTypes.PropertysPageLoaded;
    constructor(public payload: { Propertys: PropertyModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class PropertysPageCancelled implements Action {
    readonly type = PropertyActionTypes.PropertysPageCancelled;
}

export class AllPropertysRequested implements Action {
    readonly type = PropertyActionTypes.AllPropertysRequested;
}

export class AllPropertysLoaded implements Action {
    readonly type = PropertyActionTypes.AllPropertysLoaded;
    constructor(public payload: { Propertys: PropertyModel[] }) { }
}

export class PropertysPageToggleLoading implements Action {
    readonly type = PropertyActionTypes.PropertysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class PropertysActionToggleLoading implements Action {
    readonly type = PropertyActionTypes.PropertysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type PropertyActions = PropertyCreated
| PropertyUpdated
| PropertyDeleted
| PropertysPageRequested
| PropertysPageLoaded
| PropertysPageCancelled
| AllPropertysLoaded
| AllPropertysRequested
| PropertyOnServerCreated
| PropertysPageToggleLoading
| PropertysActionToggleLoading;

