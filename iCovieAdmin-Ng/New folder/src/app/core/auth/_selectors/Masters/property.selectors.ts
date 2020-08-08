import { PropertyModel } from '../../_models/Masters/property.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { PropertysState } from '../../_reducers/Masters/property.reducers';
import * as fromProperty from '../../_reducers/Masters/property.reducers';
import { each } from 'lodash';

export const selectPropertysState = createFeatureSelector<PropertysState>('propertys');

export const selectPropertyById = (categotyId: number) => createSelector(
    selectPropertysState,
    propertyState => propertyState.entities[categotyId]
);

export const allPropertysLoaded = createSelector(
    selectPropertysState,
    propertyState => propertyState.isAllPropertysLoaded
);


export const selectAllPropertys = createSelector(
    selectPropertysState,
    fromProperty.selectAll
);

export const selectAllPropertysIds = createSelector(
    selectPropertysState,
    fromProperty.selectIds
);

export const selectPropertysPageLoading = createSelector(
    selectPropertysState,
    PropertysState => PropertysState.listLoading
);

export const selectPropertysActionLoading = createSelector(
    selectPropertysState,
    PropertysState => PropertysState.actionsloading
);

export const selectLastCreatedPropertyId = createSelector(
    selectPropertysState,
    PropertysState => PropertysState.lastCreatedPropertyId
);

export const selectPropertysShowInitWaitingMessage = createSelector(
    selectPropertysState,
    PropertysState => PropertysState.showInitWaitingMessage
);


export const selectPropertyQueryResult = createSelector(
    selectPropertysState,
    PropertysState => {
        const items: PropertyModel[] = [];
        each(PropertysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: PropertyModel[] = httpExtension.sortArray(items, PropertysState.lastQuery.sortField, PropertysState.lastQuery.sortOrder);

        return new QueryResultsModel(PropertysState.queryResult, PropertysState.queryRowsCount);
    }
);
