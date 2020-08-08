import { BusinessCategoryModel } from '../../_models/Masters/businesscategory.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { BusinessCategorysState } from '../../_reducers/Masters/businesscategory.reducers';
import * as fromBusinessCategory from '../../_reducers/Masters/businesscategory.reducers';
import { each } from 'lodash';

export const selectBusinessCategorysState = createFeatureSelector<BusinessCategorysState>('businesscategorys');

export const selectBusinessCategoryById = (categotyId: number) => createSelector(
    selectBusinessCategorysState,
    businesscategoryState => businesscategoryState.entities[categotyId]
);

export const allBusinessCategorysLoaded = createSelector(
    selectBusinessCategorysState,
    businesscategoryState => businesscategoryState.isAllBusinessCategorysLoaded
);


export const selectAllBusinessCategorys = createSelector(
    selectBusinessCategorysState,
    fromBusinessCategory.selectAll
);

export const selectAllBusinessCategorysIds = createSelector(
    selectBusinessCategorysState,
    fromBusinessCategory.selectIds
);

export const selectBusinessCategorysPageLoading = createSelector(
    selectBusinessCategorysState,
    BusinessCategorysState => BusinessCategorysState.listLoading
);

export const selectBusinessCategorysActionLoading = createSelector(
    selectBusinessCategorysState,
    BusinessCategorysState => BusinessCategorysState.actionsloading
);

export const selectLastCreatedBusinessCategoryId = createSelector(
    selectBusinessCategorysState,
    BusinessCategorysState => BusinessCategorysState.lastCreatedBusinessCategoryId
);

export const selectBusinessCategorysShowInitWaitingMessage = createSelector(
    selectBusinessCategorysState,
    BusinessCategorysState => BusinessCategorysState.showInitWaitingMessage
);


export const selectBusinessCategoryQueryResult = createSelector(
    selectBusinessCategorysState,
    BusinessCategorysState => {
        const items: BusinessCategoryModel[] = [];
        each(BusinessCategorysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: BusinessCategoryModel[] = httpExtension.sortArray(items, BusinessCategorysState.lastQuery.sortField, BusinessCategorysState.lastQuery.sortOrder);

        return new QueryResultsModel(BusinessCategorysState.queryResult, BusinessCategorysState.queryRowsCount);
    }
);
