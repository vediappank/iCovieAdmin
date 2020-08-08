import { MRegionModel } from '../../_models/MGeograpical/mRegion.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { RegionsState } from '../../_reducers/MGeograpical/Region.reducers';
import * as fromRegion from '../../_reducers/MGeograpical/Region.reducers';
import { each } from 'lodash';

export const selectRegionsState = createFeatureSelector<RegionsState>('regions');

export const selectRegionById = (categotyId: number) => createSelector(
    selectRegionsState,
    RegionState => RegionState.entities[categotyId]
);

export const allRegionsLoaded = createSelector(
    selectRegionsState,
    RegionState => RegionState.isAllRegionsLoaded
);


export const selectAllRegions = createSelector(
    selectRegionsState,
    fromRegion.selectAll
);

export const selectAllRegionsIds = createSelector(
    selectRegionsState,
    fromRegion.selectIds
);

export const selectRegionsPageLoading = createSelector(
    selectRegionsState,
    RegionsState => RegionsState.listLoading
);

export const selectRegionsActionLoading = createSelector(
    selectRegionsState,
    RegionsState => RegionsState.actionsloading
);

export const selectLastCreatedRegionId = createSelector(
    selectRegionsState,
    RegionsState => RegionsState.lastCreatedRegionId
);

export const selectRegionsShowInitWaitingMessage = createSelector(
    selectRegionsState,
    RegionsState => RegionsState.showInitWaitingMessage
);


export const selectRegionQueryResult = createSelector(
    selectRegionsState,
    RegionsState => {
        const items: MRegionModel[] = [];
        each(RegionsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MRegionModel[] = httpExtension.sortArray(items, RegionsState.lastQuery.sortField, RegionsState.lastQuery.sortOrder);

        return new QueryResultsModel(RegionsState.queryResult, RegionsState.queryRowsCount);
    }
);
