import { MCompanyModel } from '../../_models/MFacilities/mcompany.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../../_base/crud';
// State
import { CompanysState } from '../../_reducers/Master/company.reducers';
import * as fromCompany from '../../_reducers/Master/company.reducers';
import { each } from 'lodash';

export const selectCompanysState = createFeatureSelector<CompanysState>('companys');

export const selectCompanyById = (categotyId: number) => createSelector(
    selectCompanysState,
    categoryState => categoryState.entities[categotyId]
);

export const allCompanysLoaded = createSelector(
    selectCompanysState,
    categoryState => categoryState.isAllCompanysLoaded
);


export const selectAllCompanys = createSelector(
    selectCompanysState,
    fromCompany.selectAll
);

export const selectAllCompanysIds = createSelector(
    selectCompanysState,
    fromCompany.selectIds
);

export const selectCompanysPageLoading = createSelector(
    selectCompanysState,
    CompanysState => CompanysState.listLoading
);

export const selectCompanysActionLoading = createSelector(
    selectCompanysState,
    CompanysState => CompanysState.actionsloading
);

export const selectLastCreatedCompanyId = createSelector(
    selectCompanysState,
    CompanysState => CompanysState.lastCreatedCompanyId
);

export const selectCompanysShowInitWaitingMessage = createSelector(
    selectCompanysState,
    CompanysState => CompanysState.showInitWaitingMessage
);


export const selectCompanyQueryResult = createSelector(
    selectCompanysState,
    CompanysState => {
        const items: MCompanyModel[] = [];
        each(CompanysState.entities, element => {
            items.push(element);
        });
        const httpExtension = new HttpExtenstionsModel();
        const result: MCompanyModel[] = httpExtension.sortArray(items, CompanysState.lastQuery.sortField, CompanysState.lastQuery.sortOrder);

        return new QueryResultsModel(CompanysState.queryResult, CompanysState.queryRowsCount);
    }
);
