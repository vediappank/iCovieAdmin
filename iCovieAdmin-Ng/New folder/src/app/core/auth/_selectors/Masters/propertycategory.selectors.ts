import { PropertyCategoryModel } from '../../_models/Masters/propertycategory.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { PropertyCategorysState } from '../../_reducers/Masters/propertycategory.reducers';
import * as fromPropertyCategory from '../../_reducers/Masters/propertycategory.reducers';
import { each } from 'lodash';

export const selectPropertyCategorysState = createFeatureSelector<PropertyCategorysState>('propertycategorys');

export const selectPropertyCategoryById = (categotyId: number) => createSelector(
    selectPropertyCategorysState,
    propertycategoryState => propertycategoryState.entities[categotyId]
);

export const allPropertyCategorysLoaded = createSelector(
    selectPropertyCategorysState,
    propertycategoryState => propertycategoryState.isAllPropertyCategorysLoaded
);


export const selectAllPropertyCategorys = createSelector(
    selectPropertyCategorysState,
    fromPropertyCategory.selectAll
);

export const selectAllPropertyCategorysIds = createSelector(
    selectPropertyCategorysState,
    fromPropertyCategory.selectIds
);

export const selectPropertyCategorysPageLoading = createSelector(
    selectPropertyCategorysState,
    PropertyCategorysState => PropertyCategorysState.listLoading
);

export const selectPropertyCategorysActionLoading = createSelector(
    selectPropertyCategorysState,
    PropertyCategorysState => PropertyCategorysState.actionsloading
);

export const selectLastCreatedPropertyCategoryId = createSelector(
    selectPropertyCategorysState,
    PropertyCategorysState => PropertyCategorysState.lastCreatedPropertyCategoryId
);

export const selectPropertyCategorysShowInitWaitingMessage = createSelector(
    selectPropertyCategorysState,
    PropertyCategorysState => PropertyCategorysState.showInitWaitingMessage
);


export const selectPropertyCategoryQueryResult = createSelector(
    selectPropertyCategorysState,
    PropertyCategorysState => {
        const items: PropertyCategoryModel[] = [];
        each(PropertyCategorysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: PropertyCategoryModel[] = httpExtension.sortArray(items, PropertyCategorysState.lastQuery.sortField, PropertyCategorysState.lastQuery.sortOrder);

        return new QueryResultsModel(PropertyCategorysState.queryResult, PropertyCategorysState.queryRowsCount);
    }
);
