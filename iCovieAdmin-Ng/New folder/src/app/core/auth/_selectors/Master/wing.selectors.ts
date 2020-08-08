import { MWingModel } from '../../_models/MFacilities/mwing.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
// import { WingsState } from '../../_reducers/Master/wing.reducers';
import { WingsState } from '../../_reducers/Master/wing.reducers';
import * as fromWing from '../../_reducers/Master/wing.reducers';
import { each } from 'lodash';

export const selectWingsState = createFeatureSelector<WingsState>('wings');

export const selectWingById = (categotyId: number) => createSelector(
    selectWingsState,
    categoryState => categoryState.entities[categotyId]
);

export const allWingsLoaded = createSelector(
    selectWingsState,
    categoryState => categoryState.isAllWingsLoaded
);


export const selectAllWings = createSelector(
    selectWingsState,
    fromWing.selectAll
);

export const selectAllWingsIds = createSelector(
    selectWingsState,
    fromWing.selectIds
);

export const selectWingsPageLoading = createSelector(
    selectWingsState,
    WingsState => WingsState.listLoading
);

export const selectWingsActionLoading = createSelector(
    selectWingsState,
    WingsState => WingsState.actionsloading
);

export const selectLastCreatedWingId = createSelector(
    selectWingsState,
    WingsState => WingsState.lastCreatedWingId
);

export const selectWingsShowInitWaitingMessage = createSelector(
    selectWingsState,
    WingsState => WingsState.showInitWaitingMessage
);


export const selectWingQueryResult = createSelector(
    selectWingsState,
    WingsState => {
        const items: MWingModel[] = [];
        each(WingsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MWingModel[] = httpExtension.sortArray(items, WingsState.lastQuery.sortField, WingsState.lastQuery.sortOrder);

        return new QueryResultsModel(WingsState.queryResult, WingsState.queryRowsCount);
    }
);
