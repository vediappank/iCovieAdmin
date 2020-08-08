// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { BusinessCategoryActions, BusinessCategoryActionTypes } from '../../_actions/Masters/businesscategory.actions';
// Models
import { BusinessCategoryModel } from '../../_models/Masters/businesscategory.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface BusinessCategorysState extends EntityState<BusinessCategoryModel> {
    isAllBusinessCategorysLoaded: boolean;
    queryRowsCount: number;
    queryResult: BusinessCategoryModel[];
    lastCreatedBusinessCategoryId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<BusinessCategoryModel> = createEntityAdapter<BusinessCategoryModel>();

export const initialBusinessCategorysState: BusinessCategorysState = adapter.getInitialState({
    isAllBusinessCategorysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedBusinessCategoryId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function BusinessCategoryReducer(state = initialBusinessCategorysState, action: BusinessCategoryActions): BusinessCategorysState {
    switch  (action.type) {
        case BusinessCategoryActionTypes.BusinessCategorysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedBusinessCategoryId: undefined
        };
        case BusinessCategoryActionTypes.BusinessCategorysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case BusinessCategoryActionTypes.BusinessCategoryOnServerCreated: return {
            ...state
        };
        case BusinessCategoryActionTypes.BusinessCategoryCreated: return adapter.addOne(action.payload.BusinessCategory, {
            ...state, lastCreatedBusinessCategoryId: action.payload.BusinessCategory.id
        });
        case BusinessCategoryActionTypes.BusinessCategoryUpdated: return adapter.updateOne(action.payload.partialBusinessCategory, state);
        case BusinessCategoryActionTypes.BusinessCategoryDeleted: return adapter.removeOne(action.payload.id, state);
        case BusinessCategoryActionTypes.AllBusinessCategorysLoaded: return adapter.addAll(action.payload.BusinessCategorys, {
            ...state, isAllBusinessCategorysLoaded: true
        });
        case BusinessCategoryActionTypes.BusinessCategorysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case BusinessCategoryActionTypes.BusinessCategorysPageLoaded: return adapter.addMany(action.payload.BusinessCategorys, {
            ...initialBusinessCategorysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.BusinessCategorys,
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
