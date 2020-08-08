import { MCountryModel } from '../../_models/MGeograpical/mcountry.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { CountrysState } from '../../_reducers/MGeograpical/country.reducers';
import * as fromCountry from '../../_reducers/MGeograpical/country.reducers';
import { each } from 'lodash';

export const selectCountrysState = createFeatureSelector<CountrysState>('countrys');

export const selectCountryById = (categotyId: number) => createSelector(
    selectCountrysState,
    categoryState => categoryState.entities[categotyId]
);

export const allCountrysLoaded = createSelector(
    selectCountrysState,
    categoryState => categoryState.isAllCountrysLoaded
);


export const selectAllCountrys = createSelector(
    selectCountrysState,
    fromCountry.selectAll
);

export const selectAllCountrysIds = createSelector(
    selectCountrysState,
    fromCountry.selectIds
);

export const selectCountrysPageLoading = createSelector(
    selectCountrysState,
    CountrysState => CountrysState.listLoading
);

export const selectCountrysActionLoading = createSelector(
    selectCountrysState,
    CountrysState => CountrysState.actionsloading
);

export const selectLastCreatedCountryId = createSelector(
    selectCountrysState,
    CountrysState => CountrysState.lastCreatedCountryId
);

export const selectCountrysShowInitWaitingMessage = createSelector(
    selectCountrysState,
    CountrysState => CountrysState.showInitWaitingMessage
);


export const selectCountryQueryResult = createSelector(
    selectCountrysState,
    CountrysState => {
        const items: MCountryModel[] = [];
        each(CountrysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MCountryModel[] = httpExtension.sortArray(items, CountrysState.lastQuery.sortField, CountrysState.lastQuery.sortOrder);

        return new QueryResultsModel(CountrysState.queryResult, CountrysState.queryRowsCount);
    }
);
