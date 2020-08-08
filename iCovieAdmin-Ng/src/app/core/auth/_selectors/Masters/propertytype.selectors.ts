import { PropertyTypeModel } from '../../_models/Masters/propertytype.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { PropertyTypesState } from '../../_reducers/Masters/propertytype.reducers';
import * as fromPropertyType from '../../_reducers/Masters/propertytype.reducers';
import { each } from 'lodash';

export const selectPropertyTypesState = createFeatureSelector<PropertyTypesState>('propertytypes');

export const selectPropertyTypeById = (categotyId: number) => createSelector(
    selectPropertyTypesState,
    propertytypeState => propertytypeState.entities[categotyId]
);

export const allPropertyTypesLoaded = createSelector(
    selectPropertyTypesState,
    propertytypeState => propertytypeState.isAllPropertyTypesLoaded
);


export const selectAllPropertyTypes = createSelector(
    selectPropertyTypesState,
    fromPropertyType.selectAll
);

export const selectAllPropertyTypesIds = createSelector(
    selectPropertyTypesState,
    fromPropertyType.selectIds
);

export const selectPropertyTypesPageLoading = createSelector(
    selectPropertyTypesState,
    PropertyTypesState => PropertyTypesState.listLoading
);

export const selectPropertyTypesActionLoading = createSelector(
    selectPropertyTypesState,
    PropertyTypesState => PropertyTypesState.actionsloading
);

export const selectLastCreatedPropertyTypeId = createSelector(
    selectPropertyTypesState,
    PropertyTypesState => PropertyTypesState.lastCreatedPropertyTypeId
);

export const selectPropertyTypesShowInitWaitingMessage = createSelector(
    selectPropertyTypesState,
    PropertyTypesState => PropertyTypesState.showInitWaitingMessage
);


export const selectPropertyTypeQueryResult = createSelector(
    selectPropertyTypesState,
    PropertyTypesState => {
        const items: PropertyTypeModel[] = [];
        each(PropertyTypesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: PropertyTypeModel[] = httpExtension.sortArray(items, PropertyTypesState.lastQuery.sortField, PropertyTypesState.lastQuery.sortOrder);

        return new QueryResultsModel(PropertyTypesState.queryResult, PropertyTypesState.queryRowsCount);
    }
);
