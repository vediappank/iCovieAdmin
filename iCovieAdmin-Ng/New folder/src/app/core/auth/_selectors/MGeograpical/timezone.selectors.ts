import { MTimeZoneModel } from '../../_models/MGeograpical/mTimeZone.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { TimeZonesState } from '../../_reducers/MGeograpical/TimeZone.reducers';
import * as fromTimeZone from '../../_reducers/MGeograpical/TimeZone.reducers';
import { each } from 'lodash';

export const selectTimeZonesState = createFeatureSelector<TimeZonesState>('timezones');

export const selectTimeZoneById = (categotyId: number) => createSelector(
    selectTimeZonesState,
    TimeZoneState => TimeZoneState.entities[categotyId]
);

export const allTimeZonesLoaded = createSelector(
    selectTimeZonesState,
    TimeZoneState => TimeZoneState.isAllTimeZonesLoaded
);


export const selectAllTimeZones = createSelector(
    selectTimeZonesState,
    fromTimeZone.selectAll
);

export const selectAllTimeZonesIds = createSelector(
    selectTimeZonesState,
    fromTimeZone.selectIds
);

export const selectTimeZonesPageLoading = createSelector(
    selectTimeZonesState,
    TimeZonesState => TimeZonesState.listLoading
);

export const selectTimeZonesActionLoading = createSelector(
    selectTimeZonesState,
    TimeZonesState => TimeZonesState.actionsloading
);

export const selectLastCreatedTimeZoneId = createSelector(
    selectTimeZonesState,
    TimeZonesState => TimeZonesState.lastCreatedTimeZoneId
);

export const selectTimeZonesShowInitWaitingMessage = createSelector(
    selectTimeZonesState,
    TimeZonesState => TimeZonesState.showInitWaitingMessage
);


export const selectTimeZoneQueryResult = createSelector(
    selectTimeZonesState,
    TimeZonesState => {
        const items: MTimeZoneModel[] = [];
        each(TimeZonesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MTimeZoneModel[] = httpExtension.sortArray(items, TimeZonesState.lastQuery.sortField, TimeZonesState.lastQuery.sortOrder);

        return new QueryResultsModel(TimeZonesState.queryResult, TimeZonesState.queryRowsCount);
    }
);
