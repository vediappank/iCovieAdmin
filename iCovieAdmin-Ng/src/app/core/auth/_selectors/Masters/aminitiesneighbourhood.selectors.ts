import { AminitiesNeighbourhoodModel } from '../../_models/Masters/aminitiesneighbourhood.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { AminitiesNeighbourhoodsState } from '../../_reducers/Masters/aminitiesneighbourhood.reducers';
import * as fromAminitiesNeighbourhood from '../../_reducers/Masters/aminitiesneighbourhood.reducers';
import { each } from 'lodash';

export const selectAminitiesNeighbourhoodsState = createFeatureSelector<AminitiesNeighbourhoodsState>('aminitiesneighbourhoods');

export const selectAminitiesNeighbourhoodById = (categotyId: number) => createSelector(
    selectAminitiesNeighbourhoodsState,
    aminitiesneighbourhoodState => aminitiesneighbourhoodState.entities[categotyId]
);

export const allAminitiesNeighbourhoodsLoaded = createSelector(
    selectAminitiesNeighbourhoodsState,
    aminitiesneighbourhoodState => aminitiesneighbourhoodState.isAllAminitiesNeighbourhoodsLoaded
);


export const selectAllAminitiesNeighbourhoods = createSelector(
    selectAminitiesNeighbourhoodsState,
    fromAminitiesNeighbourhood.selectAll
);

export const selectAllAminitiesNeighbourhoodsIds = createSelector(
    selectAminitiesNeighbourhoodsState,
    fromAminitiesNeighbourhood.selectIds
);

export const selectAminitiesNeighbourhoodsPageLoading = createSelector(
    selectAminitiesNeighbourhoodsState,
    AminitiesNeighbourhoodsState => AminitiesNeighbourhoodsState.listLoading
);

export const selectAminitiesNeighbourhoodsActionLoading = createSelector(
    selectAminitiesNeighbourhoodsState,
    AminitiesNeighbourhoodsState => AminitiesNeighbourhoodsState.actionsloading
);

export const selectLastCreatedAminitiesNeighbourhoodId = createSelector(
    selectAminitiesNeighbourhoodsState,
    AminitiesNeighbourhoodsState => AminitiesNeighbourhoodsState.lastCreatedAminitiesNeighbourhoodId
);

export const selectAminitiesNeighbourhoodsShowInitWaitingMessage = createSelector(
    selectAminitiesNeighbourhoodsState,
    AminitiesNeighbourhoodsState => AminitiesNeighbourhoodsState.showInitWaitingMessage
);


export const selectAminitiesNeighbourhoodQueryResult = createSelector(
    selectAminitiesNeighbourhoodsState,
    AminitiesNeighbourhoodsState => {
        const items: AminitiesNeighbourhoodModel[] = [];
        each(AminitiesNeighbourhoodsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: AminitiesNeighbourhoodModel[] = httpExtension.sortArray(items, AminitiesNeighbourhoodsState.lastQuery.sortField, AminitiesNeighbourhoodsState.lastQuery.sortOrder);

        return new QueryResultsModel(AminitiesNeighbourhoodsState.queryResult, AminitiesNeighbourhoodsState.queryRowsCount);
    }
);
