import { MCityModel } from '../../_models/MGeograpical/mcity.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { CitysState } from '../../_reducers/MGeograpical/City.reducers';
import * as fromCity from '../../_reducers/MGeograpical/City.reducers';
import { each } from 'lodash';

export const selectCitysState = createFeatureSelector<CitysState>('citys');

export const selectCityById = (categotyId: number) => createSelector(
    selectCitysState,
    CityState => CityState.entities[categotyId]
);

export const allCitysLoaded = createSelector(
    selectCitysState,
    CityState => CityState.isAllCitysLoaded
);


export const selectAllCitys = createSelector(
    selectCitysState,
    fromCity.selectAll
);

export const selectAllCitysIds = createSelector(
    selectCitysState,
    fromCity.selectIds
);

export const selectCitysPageLoading = createSelector(
    selectCitysState,
    CitysState => CitysState.listLoading
);

export const selectCitysActionLoading = createSelector(
    selectCitysState,
    CitysState => CitysState.actionsloading
);

export const selectLastCreatedCityId = createSelector(
    selectCitysState,
    CitysState => CitysState.lastCreatedCityId
);

export const selectCitysShowInitWaitingMessage = createSelector(
    selectCitysState,
    CitysState => CitysState.showInitWaitingMessage
);


export const selectCityQueryResult = createSelector(
    selectCitysState,
    CitysState => {
        const items: MCityModel[] = [];
        each(CitysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MCityModel[] = httpExtension.sortArray(items, CitysState.lastQuery.sortField, CitysState.lastQuery.sortOrder);

        return new QueryResultsModel(CitysState.queryResult, CitysState.queryRowsCount);
    }
);
