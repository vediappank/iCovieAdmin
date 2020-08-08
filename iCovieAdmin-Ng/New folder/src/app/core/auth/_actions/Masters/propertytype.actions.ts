
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { PropertyTypeModel } from '../../_models/Masters/propertytype.model';

export enum PropertyTypeActionTypes {
    AllPropertyTypesRequested = '[PropertyTypes Home Page] All PropertyTypes Requested',
    AllPropertyTypesLoaded = '[PropertyTypes API] All PropertyTypes Loaded',
    PropertyTypeOnServerCreated = '[Edit PropertyType Dialog] PropertyType On Server Created',
    PropertyTypeCreated = '[Edit PropertyTypes Dialog] PropertyTypes Created',
    PropertyTypeUpdated = '[Edit PropertyType Dialog] PropertyType Updated',
    PropertyTypeDeleted = '[PropertyTypes List Page] PropertyType Deleted',
    PropertyTypesPageRequested = '[PropertyTypes List Page] PropertyTypes Page Requested',
    PropertyTypesPageLoaded = '[PropertyTypes API] PropertyTypes Page Loaded',
    PropertyTypesPageCancelled = '[PropertyTypes API] PropertyTypes Page Cancelled',
    PropertyTypesPageToggleLoading = '[PropertyTypes page] PropertyTypes Page Toggle Loading',
    PropertyTypesActionToggleLoading = '[PropertyTypes] PropertyTypes Action Toggle Loading'
}

export class PropertyTypeOnServerCreated implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypeOnServerCreated;
    constructor(public payload: { PropertyType: PropertyTypeModel }) { }
}

export class PropertyTypeCreated implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypeCreated;
    constructor(public payload: { PropertyType: PropertyTypeModel }) { }
}

export class PropertyTypeUpdated implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypeUpdated;
    constructor(public payload: {
        partialPropertyType: Update<PropertyTypeModel>,
        PropertyType: PropertyTypeModel
    }) { }
}

export class PropertyTypeDeleted implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypeDeleted;
    constructor(public payload: { id: number }) {}
}

export class PropertyTypesPageRequested implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypesPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class PropertyTypesPageLoaded implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypesPageLoaded;
    constructor(public payload: { PropertyTypes: PropertyTypeModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class PropertyTypesPageCancelled implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypesPageCancelled;
}

export class AllPropertyTypesRequested implements Action {
    readonly type = PropertyTypeActionTypes.AllPropertyTypesRequested;
}

export class AllPropertyTypesLoaded implements Action {
    readonly type = PropertyTypeActionTypes.AllPropertyTypesLoaded;
    constructor(public payload: { PropertyTypes: PropertyTypeModel[] }) { }
}

export class PropertyTypesPageToggleLoading implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypesPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class PropertyTypesActionToggleLoading implements Action {
    readonly type = PropertyTypeActionTypes.PropertyTypesActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type PropertyTypeActions = PropertyTypeCreated
| PropertyTypeUpdated
| PropertyTypeDeleted
| PropertyTypesPageRequested
| PropertyTypesPageLoaded
| PropertyTypesPageCancelled
| AllPropertyTypesLoaded
| AllPropertyTypesRequested
| PropertyTypeOnServerCreated
| PropertyTypesPageToggleLoading
| PropertyTypesActionToggleLoading;

