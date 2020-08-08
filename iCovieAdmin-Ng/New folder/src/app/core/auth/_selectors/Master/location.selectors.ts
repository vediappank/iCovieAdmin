import { MLocationModel } from '../../_models/MFacilities/mlocation.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { LocationsState } from '../../_reducers/Master/location.reducers';
import * as fromLocation from '../../_reducers/Master/location.reducers';
import { each } from 'lodash';

export const selectLocationsState = createFeatureSelector<LocationsState>('locations');

export const selectLocationById = (categotyId: number) => createSelector(
    selectLocationsState,
    categoryState => categoryState.entities[categotyId]
);

export const allLocationsLoaded = createSelector(
    selectLocationsState,
    categoryState => categoryState.isAllLocationsLoaded
);


export const selectAllLocations = createSelector(
    selectLocationsState,
    fromLocation.selectAll
);

export const selectAllLocationsIds = createSelector(
    selectLocationsState,
    fromLocation.selectIds
);

export const selectLocationsPageLoading = createSelector(
    selectLocationsState,
    LocationsState => LocationsState.listLoading
);

export const selectLocationsActionLoading = createSelector(
    selectLocationsState,
    LocationsState => LocationsState.actionsloading
);

export const selectLastCreatedLocationId = createSelector(
    selectLocationsState,
    LocationsState => LocationsState.lastCreatedLocationId
);

export const selectLocationsShowInitWaitingMessage = createSelector(
    selectLocationsState,
    LocationsState => LocationsState.showInitWaitingMessage
);


export const selectLocationQueryResult = createSelector(
    selectLocationsState,
    LocationsState => {
        const items: MLocationModel[] = [];
        each(LocationsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MLocationModel[] = httpExtension.sortArray(items, LocationsState.lastQuery.sortField, LocationsState.lastQuery.sortOrder);

        return new QueryResultsModel(LocationsState.queryResult, LocationsState.queryRowsCount);
    }
);
