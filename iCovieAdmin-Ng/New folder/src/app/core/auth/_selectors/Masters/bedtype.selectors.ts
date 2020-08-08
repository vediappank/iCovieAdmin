import { BedTypeModel } from '../../_models/Masters/bedtype.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { BedTypesState } from '../../_reducers/Masters/bedtype.reducers';
import * as fromBedType from '../../_reducers/Masters/bedtype.reducers';
import { each } from 'lodash';

export const selectBedTypesState = createFeatureSelector<BedTypesState>('bedtypes');

export const selectBedTypeById = (categotyId: number) => createSelector(
    selectBedTypesState,
    bedtypeState => bedtypeState.entities[categotyId]
);

export const allBedTypesLoaded = createSelector(
    selectBedTypesState,
    bedtypeState => bedtypeState.isAllBedTypesLoaded
);


export const selectAllBedTypes = createSelector(
    selectBedTypesState,
    fromBedType.selectAll
);

export const selectAllBedTypesIds = createSelector(
    selectBedTypesState,
    fromBedType.selectIds
);

export const selectBedTypesPageLoading = createSelector(
    selectBedTypesState,
    BedTypesState => BedTypesState.listLoading
);

export const selectBedTypesActionLoading = createSelector(
    selectBedTypesState,
    BedTypesState => BedTypesState.actionsloading
);

export const selectLastCreatedBedTypeId = createSelector(
    selectBedTypesState,
    BedTypesState => BedTypesState.lastCreatedBedTypeId
);

export const selectBedTypesShowInitWaitingMessage = createSelector(
    selectBedTypesState,
    BedTypesState => BedTypesState.showInitWaitingMessage
);


export const selectBedTypeQueryResult = createSelector(
    selectBedTypesState,
    BedTypesState => {
        const items: BedTypeModel[] = [];
        each(BedTypesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: BedTypeModel[] = httpExtension.sortArray(items, BedTypesState.lastQuery.sortField, BedTypesState.lastQuery.sortOrder);

        return new QueryResultsModel(BedTypesState.queryResult, BedTypesState.queryRowsCount);
    }
);
