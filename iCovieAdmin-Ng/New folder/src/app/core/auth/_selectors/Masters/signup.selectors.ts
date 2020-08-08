import { SignupModel } from '../../_models/Masters/signup.model'

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { SignupsState } from '../../_reducers/Masters/signup.reducers';
import * as fromSignup from '../../_reducers/Masters/signup.reducers';
import { each } from 'lodash';

export const selectSignupsState = createFeatureSelector<SignupsState>('signups');

export const selectSignupById = (categotyId: number) => createSelector(
    selectSignupsState,
    signupState => signupState.entities[categotyId]
);

export const allSignupsLoaded = createSelector(
    selectSignupsState,
    signupState => signupState.isAllSignupsLoaded
);


export const selectAllSignups = createSelector(
    selectSignupsState,
    fromSignup.selectAll
);

export const selectAllSignupsIds = createSelector(
    selectSignupsState,
    fromSignup.selectIds
);

export const selectSignupsPageLoading = createSelector(
    selectSignupsState,
    SignupsState => SignupsState.listLoading
);

export const selectSignupsActionLoading = createSelector(
    selectSignupsState,
    SignupsState => SignupsState.actionsloading
);

export const selectLastCreatedSignupId = createSelector(
    selectSignupsState,
    SignupsState => SignupsState.lastCreatedSignupId
);

export const selectSignupsShowInitWaitingMessage = createSelector(
    selectSignupsState,
    SignupsState => SignupsState.showInitWaitingMessage
);


export const selectSignupQueryResult = createSelector(
    selectSignupsState,
    SignupsState => {
        const items: SignupModel[] = [];
        each(SignupsState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: SignupModel[] = httpExtension.sortArray(items, SignupsState.lastQuery.sortField, SignupsState.lastQuery.sortOrder);

        return new QueryResultsModel(SignupsState.queryResult, SignupsState.queryRowsCount);
    }
);
