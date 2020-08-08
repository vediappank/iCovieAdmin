
// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../../_base/crud';
// Models
import { PropertyCategoryModel } from '../../_models/Masters/propertycategory.model';

export enum PropertyCategoryActionTypes {
    AllPropertyCategorysRequested = '[PropertyCategorys Home Page] All PropertyCategorys Requested',
    AllPropertyCategorysLoaded = '[PropertyCategorys API] All PropertyCategorys Loaded',
    PropertyCategoryOnServerCreated = '[Edit PropertyCategory Dialog] PropertyCategory On Server Created',
    PropertyCategoryCreated = '[Edit PropertyCategorys Dialog] PropertyCategorys Created',
    PropertyCategoryUpdated = '[Edit PropertyCategory Dialog] PropertyCategory Updated',
    PropertyCategoryDeleted = '[PropertyCategorys List Page] PropertyCategory Deleted',
    PropertyCategorysPageRequested = '[PropertyCategorys List Page] PropertyCategorys Page Requested',
    PropertyCategorysPageLoaded = '[PropertyCategorys API] PropertyCategorys Page Loaded',
    PropertyCategorysPageCancelled = '[PropertyCategorys API] PropertyCategorys Page Cancelled',
    PropertyCategorysPageToggleLoading = '[PropertyCategorys page] PropertyCategorys Page Toggle Loading',
    PropertyCategorysActionToggleLoading = '[PropertyCategorys] PropertyCategorys Action Toggle Loading'
}

export class PropertyCategoryOnServerCreated implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategoryOnServerCreated;
    constructor(public payload: { PropertyCategory: PropertyCategoryModel }) { }
}

export class PropertyCategoryCreated implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategoryCreated;
    constructor(public payload: { PropertyCategory: PropertyCategoryModel }) { }
}

export class PropertyCategoryUpdated implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategoryUpdated;
    constructor(public payload: {
        partialPropertyCategory: Update<PropertyCategoryModel>,
        PropertyCategory: PropertyCategoryModel
    }) { }
}

export class PropertyCategoryDeleted implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategoryDeleted;
    constructor(public payload: { id: number }) {}
}

export class PropertyCategorysPageRequested implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategorysPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class PropertyCategorysPageLoaded implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategorysPageLoaded;
    constructor(public payload: { PropertyCategorys: PropertyCategoryModel[], totalCount: number, page: QueryParamsModel }) { }
}

export class PropertyCategorysPageCancelled implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategorysPageCancelled;
}

export class AllPropertyCategorysRequested implements Action {
    readonly type = PropertyCategoryActionTypes.AllPropertyCategorysRequested;
}

export class AllPropertyCategorysLoaded implements Action {
    readonly type = PropertyCategoryActionTypes.AllPropertyCategorysLoaded;
    constructor(public payload: { PropertyCategorys: PropertyCategoryModel[] }) { }
}

export class PropertyCategorysPageToggleLoading implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategorysPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class PropertyCategorysActionToggleLoading implements Action {
    readonly type = PropertyCategoryActionTypes.PropertyCategorysActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type PropertyCategoryActions = PropertyCategoryCreated
| PropertyCategoryUpdated
| PropertyCategoryDeleted
| PropertyCategorysPageRequested
| PropertyCategorysPageLoaded
| PropertyCategorysPageCancelled
| AllPropertyCategorysLoaded
| AllPropertyCategorysRequested
| PropertyCategoryOnServerCreated
| PropertyCategorysPageToggleLoading
| PropertyCategorysActionToggleLoading;

