import { AminitiesTypeModel } from '../../_models/Masters/aminitiestype.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { AminitiesTypesState } from '../../_reducers/Masters/aminitiestype.reducers';
import * as fromAminitiesType from '../../_reducers/Masters/aminitiestype.reducers';
import { each } from 'lodash';

export const selectAminitiesTypesState = createFeatureSelector<AminitiesTypesState>('aminitiestypes');

export const selectAminitiesTypeById = (categotyId: number) => createSelector(
    selectAminitiesTypesState,
    aminitiestypeState => aminitiestypeState.entities[categotyId]
);

export const allAminitiesTypesLoaded = createSelector(
    selectAminitiesTypesState,
    aminitiestypeState => aminitiestypeState.isAllAminitiesTypesLoaded
);


export const selectAllAminitiesTypes = createSelector(
    selectAminitiesTypesState,
    fromAminitiesType.selectAll
);

export const selectAllAminitiesTypesIds = createSelector(
    selectAminitiesTypesState,
    fromAminitiesType.selectIds
);

export const selectAminitiesTypesPageLoading = createSelector(
    selectAminitiesTypesState,
    AminitiesTypesState => AminitiesTypesState.listLoading
);

export const selectAminitiesTypesActionLoading = createSelector(
    selectAminitiesTypesState,
    AminitiesTypesState => AminitiesTypesState.actionsloading
);

export const selectLastCreatedAminitiesTypeId = createSelector(
    selectAminitiesTypesState,
    AminitiesTypesState => AminitiesTypesState.lastCreatedAminitiesTypeId
);

export const selectAminitiesTypesShowInitWaitingMessage = createSelector(
    selectAminitiesTypesState,
    AminitiesTypesState => AminitiesTypesState.showInitWaitingMessage
);


export const selectAminitiesTypeQueryResult = createSelector(
    selectAminitiesTypesState,
    AminitiesTypesState => {
        const items: AminitiesTypeModel[] = [];
        each(AminitiesTypesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: AminitiesTypeModel[] = httpExtension.sortArray(items, AminitiesTypesState.lastQuery.sortField, AminitiesTypesState.lastQuery.sortOrder);

        return new QueryResultsModel(AminitiesTypesState.queryResult, AminitiesTypesState.queryRowsCount);
    }
);
