import { MFloorModel } from '../../_models/MFacilities/mfloor.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { FloorsState } from '../../_reducers/Master/floor.reducers';
import * as fromFloor from '../../_reducers/Master/floor.reducers';
import { each } from 'lodash';

export const selectFloorsState = createFeatureSelector<FloorsState>('floors');

export const selectFloorById = (categotyId: number) => createSelector(
    selectFloorsState,
    categoryState => categoryState.entities[categotyId]
);

export const allFloorsLoaded = createSelector(
    selectFloorsState,
    categoryState => categoryState.isAllFloorsLoaded
);


export const selectAllFloors = createSelector(
    selectFloorsState,
    fromFloor.selectAll
);

export const selectAllFloorsIds = createSelector(
    selectFloorsState,
    fromFloor.selectIds
);

export const selectFloorsPageLoading = createSelector(
    selectFloorsState,
    FloorsState => FloorsState.listLoading
);

export const selectFloorsActionLoading = createSelector(
    selectFloorsState,
    FloorsState => FloorsState.actionsloading
);

export const selectLastCreatedFloorId = createSelector(
    selectFloorsState,
    FloorsState => FloorsState.lastCreatedFloorId
);

export const selectFloorsShowInitWaitingMessage = createSelector(
    selectFloorsState,
    FloorsState => FloorsState.showInitWaitingMessage
);


export const selectFloorQueryResult = createSelector(
    selectFloorsState,
    FloorsState => {
        const items: MFloorModel[] = [];
        each(FloorsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MFloorModel[] = httpExtension.sortArray(items, FloorsState.lastQuery.sortField, FloorsState.lastQuery.sortOrder);

        return new QueryResultsModel(FloorsState.queryResult, FloorsState.queryRowsCount);
    }
);
