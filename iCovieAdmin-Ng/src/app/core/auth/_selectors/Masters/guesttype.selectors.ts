import { GuestTypeModel } from '../../_models/Masters/guesttype.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { GuestTypesState } from '../../_reducers/Masters/guesttype.reducers';
import * as fromGuestType from '../../_reducers/Masters/guesttype.reducers';
import { each } from 'lodash';

export const selectGuestTypesState = createFeatureSelector<GuestTypesState>('guesttypes');

export const selectGuestTypeById = (categotyId: number) => createSelector(
    selectGuestTypesState,
    guesttypeState => guesttypeState.entities[categotyId]
);

export const allGuestTypesLoaded = createSelector(
    selectGuestTypesState,
    guesttypeState => guesttypeState.isAllGuestTypesLoaded
);


export const selectAllGuestTypes = createSelector(
    selectGuestTypesState,
    fromGuestType.selectAll
);

export const selectAllGuestTypesIds = createSelector(
    selectGuestTypesState,
    fromGuestType.selectIds
);

export const selectGuestTypesPageLoading = createSelector(
    selectGuestTypesState,
    GuestTypesState => GuestTypesState.listLoading
);

export const selectGuestTypesActionLoading = createSelector(
    selectGuestTypesState,
    GuestTypesState => GuestTypesState.actionsloading
);

export const selectLastCreatedGuestTypeId = createSelector(
    selectGuestTypesState,
    GuestTypesState => GuestTypesState.lastCreatedGuestTypeId
);

export const selectGuestTypesShowInitWaitingMessage = createSelector(
    selectGuestTypesState,
    GuestTypesState => GuestTypesState.showInitWaitingMessage
);


export const selectGuestTypeQueryResult = createSelector(
    selectGuestTypesState,
    GuestTypesState => {
        const items: GuestTypeModel[] = [];
        each(GuestTypesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: GuestTypeModel[] = httpExtension.sortArray(items, GuestTypesState.lastQuery.sortField, GuestTypesState.lastQuery.sortOrder);

        return new QueryResultsModel(GuestTypesState.queryResult, GuestTypesState.queryRowsCount);
    }
);
