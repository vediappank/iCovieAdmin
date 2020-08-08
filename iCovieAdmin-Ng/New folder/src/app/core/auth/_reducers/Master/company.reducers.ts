// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CompanyActions, CompanyActionTypes } from '../../_actions/Master/company.actions';
import { MCompanyModel } from '../../_models/MFacilities/mcompany.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface CompanysState extends EntityState<MCompanyModel> {
    isAllCompanysLoaded: boolean;
    queryRowsCount: number;
    queryResult: MCompanyModel[];
    lastCreatedCompanyId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MCompanyModel> = createEntityAdapter<MCompanyModel>();

export const initialCompanysState: CompanysState = adapter.getInitialState({
    isAllCompanysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedCompanyId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function CompanyReducer(state = initialCompanysState, action: CompanyActions): CompanysState {
    switch  (action.type) {
        case CompanyActionTypes.CompanysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedCompanyId: undefined
        };
        case CompanyActionTypes.CompanysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CompanyActionTypes.CompanyOnServerCreated: return {
            ...state
        };
        case CompanyActionTypes.CompanyCreated: return adapter.addOne(action.payload.Company, {
            ...state, lastCreatedCompanyId: action.payload.Company.id
        });
        case CompanyActionTypes.CompanyUpdated: return adapter.updateOne(action.payload.partialCompany, state);
        case CompanyActionTypes.CompanyDeleted: return adapter.removeOne(action.payload.id, state);
        case CompanyActionTypes.AllCompanysLoaded: return adapter.addAll(action.payload.Companys, {
            ...state, isAllCompanysLoaded: true
        });
        case CompanyActionTypes.CompanysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CompanyActionTypes.CompanysPageLoaded: return adapter.addMany(action.payload.Companys, {
            ...initialCompanysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Companys,
            lastQuery: action.payload.page,
            showInitWaitingMessage: false
        });
        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
