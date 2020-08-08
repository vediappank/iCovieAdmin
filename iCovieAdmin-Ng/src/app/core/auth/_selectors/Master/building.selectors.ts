import { MBuildingModel } from '../../_models/MFacilities/mbuilding.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { BuildingsState } from '../../_reducers/Master/building.reducers';
import * as fromBuilding from '../../_reducers/Master/building.reducers';
import { each } from 'lodash';

export const selectBuildingsState = createFeatureSelector<BuildingsState>('buildings');

export const selectBuildingById = (categotyId: number) => createSelector(
    selectBuildingsState,
    categoryState => categoryState.entities[categotyId]
);

export const allBuildingsLoaded = createSelector(
    selectBuildingsState,
    categoryState => categoryState.isAllBuildingsLoaded
);


export const selectAllBuildings = createSelector(
    selectBuildingsState,
    fromBuilding.selectAll
);

export const selectAllBuildingsIds = createSelector(
    selectBuildingsState,
    fromBuilding.selectIds
);

export const selectBuildingsPageLoading = createSelector(
    selectBuildingsState,
    BuildingsState => BuildingsState.listLoading
);

export const selectBuildingsActionLoading = createSelector(
    selectBuildingsState,
    BuildingsState => BuildingsState.actionsloading
);

export const selectLastCreatedBuildingId = createSelector(
    selectBuildingsState,
    BuildingsState => BuildingsState.lastCreatedBuildingId
);

export const selectBuildingsShowInitWaitingMessage = createSelector(
    selectBuildingsState,
    BuildingsState => BuildingsState.showInitWaitingMessage
);


export const selectBuildingQueryResult = createSelector(
    selectBuildingsState,
    BuildingsState => {
        const items: MBuildingModel[] = [];
        each(BuildingsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MBuildingModel[] = httpExtension.sortArray(items, BuildingsState.lastQuery.sortField, BuildingsState.lastQuery.sortOrder);

        return new QueryResultsModel(BuildingsState.queryResult, BuildingsState.queryRowsCount);
    }
);
