import { AminitiesModel } from '../../_models/Masters/aminities.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { AminitiessState } from '../../_reducers/Masters/aminities.reducers';
import * as fromAminities from '../../_reducers/Masters/aminities.reducers';
import { each } from 'lodash';

export const selectAminitiessState = createFeatureSelector<AminitiessState>('aminitiess');

export const selectAminitiesById = (categotyId: number) => createSelector(
    selectAminitiessState,
    aminitiesState => aminitiesState.entities[categotyId]
);

export const allAminitiessLoaded = createSelector(
    selectAminitiessState,
    aminitiesState => aminitiesState.isAllAminitiessLoaded
);


export const selectAllAminitiess = createSelector(
    selectAminitiessState,
    fromAminities.selectAll
);

export const selectAllAminitiessIds = createSelector(
    selectAminitiessState,
    fromAminities.selectIds
);

export const selectAminitiessPageLoading = createSelector(
    selectAminitiessState,
    AminitiessState => AminitiessState.listLoading
);

export const selectAminitiessActionLoading = createSelector(
    selectAminitiessState,
    AminitiessState => AminitiessState.actionsloading
);

export const selectLastCreatedAminitiesId = createSelector(
    selectAminitiessState,
    AminitiessState => AminitiessState.lastCreatedAminitiesId
);

export const selectAminitiessShowInitWaitingMessage = createSelector(
    selectAminitiessState,
    AminitiessState => AminitiessState.showInitWaitingMessage
);


export const selectAminitiesQueryResult = createSelector(
    selectAminitiessState,
    AminitiessState => {
        const items: AminitiesModel[] = [];
        each(AminitiessState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: AminitiesModel[] = httpExtension.sortArray(items, AminitiessState.lastQuery.sortField, AminitiessState.lastQuery.sortOrder);

        return new QueryResultsModel(AminitiessState.queryResult, AminitiessState.queryRowsCount);
    }
);
