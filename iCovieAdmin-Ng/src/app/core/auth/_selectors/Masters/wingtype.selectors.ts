import { WingTypeModel } from '../../_models/Masters/wingtype.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { WingTypesState } from '../../_reducers/Masters/wingtype.reducers';
import * as fromWingType from '../../_reducers/Masters/wingtype.reducers';
import { each } from 'lodash';

export const selectWingTypesState = createFeatureSelector<WingTypesState>('wingtypes');

export const selectWingTypeById = (categotyId: number) => createSelector(
    selectWingTypesState,
    wingtypeState => wingtypeState.entities[categotyId]
);

export const allWingTypesLoaded = createSelector(
    selectWingTypesState,
    wingtypeState => wingtypeState.isAllWingTypesLoaded
);


export const selectAllWingTypes = createSelector(
    selectWingTypesState,
    fromWingType.selectAll
);

export const selectAllWingTypesIds = createSelector(
    selectWingTypesState,
    fromWingType.selectIds
);

export const selectWingTypesPageLoading = createSelector(
    selectWingTypesState,
    WingTypesState => WingTypesState.listLoading
);

export const selectWingTypesActionLoading = createSelector(
    selectWingTypesState,
    WingTypesState => WingTypesState.actionsloading
);

export const selectLastCreatedWingTypeId = createSelector(
    selectWingTypesState,
    WingTypesState => WingTypesState.lastCreatedWingTypeId
);

export const selectWingTypesShowInitWaitingMessage = createSelector(
    selectWingTypesState,
    WingTypesState => WingTypesState.showInitWaitingMessage
);


export const selectWingTypeQueryResult = createSelector(
    selectWingTypesState,
    WingTypesState => {
        const items: WingTypeModel[] = [];
        each(WingTypesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: WingTypeModel[] = httpExtension.sortArray(items, WingTypesState.lastQuery.sortField, WingTypesState.lastQuery.sortOrder);

        return new QueryResultsModel(WingTypesState.queryResult, WingTypesState.queryRowsCount);
    }
);
