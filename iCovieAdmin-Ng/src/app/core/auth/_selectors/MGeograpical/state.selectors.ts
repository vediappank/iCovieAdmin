import { MStateModel } from '../../_models/MGeograpical/mstate.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { StatesState } from '../../_reducers/MGeograpical/State.reducers';
import * as fromState from '../../_reducers/MGeograpical/State.reducers';
import { each } from 'lodash';

export const selectStatesState = createFeatureSelector<StatesState>('states');

export const selectStateById = (categotyId: number) => createSelector(
    selectStatesState,
    StateState => StateState.entities[categotyId]
);

export const allStatesLoaded = createSelector(
    selectStatesState,
    StateState => StateState.isAllStatesLoaded
);


export const selectAllStates = createSelector(
    selectStatesState,
    fromState.selectAll
);

export const selectAllStatesIds = createSelector(
    selectStatesState,
    fromState.selectIds
);

export const selectStatesPageLoading = createSelector(
    selectStatesState,
    StatesState => StatesState.listLoading
);

export const selectStatesActionLoading = createSelector(
    selectStatesState,
    StatesState => StatesState.actionsloading
);

export const selectLastCreatedStateId = createSelector(
    selectStatesState,
    StatesState => StatesState.lastCreatedStateId
);

export const selectStatesShowInitWaitingMessage = createSelector(
    selectStatesState,
    StatesState => StatesState.showInitWaitingMessage
);


export const selectStateQueryResult = createSelector(
    selectStatesState,
    StatesState => {
        const items: MStateModel[] = [];
        each(StatesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MStateModel[] = httpExtension.sortArray(items, StatesState.lastQuery.sortField, StatesState.lastQuery.sortOrder);

        return new QueryResultsModel(StatesState.queryResult, StatesState.queryRowsCount);
    }
);
