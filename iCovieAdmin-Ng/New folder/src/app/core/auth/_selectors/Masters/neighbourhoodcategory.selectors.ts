import { NeighbourhoodCategoryModel } from '../../_models/Masters/NeighbourhoodCategory.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { NeighbourhoodCategorysState } from '../../_reducers/Masters/neighbourhoodcategory.reducers';
import * as fromNeighbourhoodCategory from '../../_reducers/Masters/neighbourhoodcategory.reducers';
import { each } from 'lodash';

export const selectNeighbourhoodCategorysState = createFeatureSelector<NeighbourhoodCategorysState>('neighbourhoodcategorys');

export const selectNeighbourhoodCategoryById = (categotyId: number) => createSelector(
    selectNeighbourhoodCategorysState,
    neighbourhoodcategoryState => neighbourhoodcategoryState.entities[categotyId]
);

export const allNeighbourhoodCategorysLoaded = createSelector(
    selectNeighbourhoodCategorysState,
    neighbourhoodcategoryState => neighbourhoodcategoryState.isAllNeighbourhoodCategorysLoaded
);


export const selectAllNeighbourhoodCategorys = createSelector(
    selectNeighbourhoodCategorysState,
    fromNeighbourhoodCategory.selectAll
);

export const selectAllNeighbourhoodCategorysIds = createSelector(
    selectNeighbourhoodCategorysState,
    fromNeighbourhoodCategory.selectIds
);

export const selectNeighbourhoodCategorysPageLoading = createSelector(
    selectNeighbourhoodCategorysState,
    NeighbourhoodCategorysState => NeighbourhoodCategorysState.listLoading
);

export const selectNeighbourhoodCategorysActionLoading = createSelector(
    selectNeighbourhoodCategorysState,
    NeighbourhoodCategorysState => NeighbourhoodCategorysState.actionsloading
);

export const selectLastCreatedNeighbourhoodCategoryId = createSelector(
    selectNeighbourhoodCategorysState,
    NeighbourhoodCategorysState => NeighbourhoodCategorysState.lastCreatedNeighbourhoodCategoryId
);

export const selectNeighbourhoodCategorysShowInitWaitingMessage = createSelector(
    selectNeighbourhoodCategorysState,
    NeighbourhoodCategorysState => NeighbourhoodCategorysState.showInitWaitingMessage
);


export const selectNeighbourhoodCategoryQueryResult = createSelector(
    selectNeighbourhoodCategorysState,
    NeighbourhoodCategorysState => {
        const items: NeighbourhoodCategoryModel[] = [];
        each(NeighbourhoodCategorysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: NeighbourhoodCategoryModel[] = httpExtension.sortArray(items, NeighbourhoodCategorysState.lastQuery.sortField, NeighbourhoodCategorysState.lastQuery.sortOrder);

        return new QueryResultsModel(NeighbourhoodCategorysState.queryResult, NeighbourhoodCategorysState.queryRowsCount);
    }
);
