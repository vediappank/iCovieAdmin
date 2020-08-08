// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { NeighbourhoodCategoryActions, NeighbourhoodCategoryActionTypes } from '../../_actions/Masters/neighbourhoodcategory.actions';
// Models
import { NeighbourhoodCategoryModel } from '../../_models/Masters/NeighbourhoodCategory.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface NeighbourhoodCategorysState extends EntityState<NeighbourhoodCategoryModel> {
    isAllNeighbourhoodCategorysLoaded: boolean;
    queryRowsCount: number;
    queryResult: NeighbourhoodCategoryModel[];
    lastCreatedNeighbourhoodCategoryId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<NeighbourhoodCategoryModel> = createEntityAdapter<NeighbourhoodCategoryModel>();

export const initialNeighbourhoodCategorysState: NeighbourhoodCategorysState = adapter.getInitialState({
    isAllNeighbourhoodCategorysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedNeighbourhoodCategoryId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function NeighbourhoodCategoryReducer(state = initialNeighbourhoodCategorysState, action: NeighbourhoodCategoryActions): NeighbourhoodCategorysState {
    switch  (action.type) {
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedNeighbourhoodCategoryId: undefined
        };
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryOnServerCreated: return {
            ...state
        };
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryCreated: return adapter.addOne(action.payload.NeighbourhoodCategory, {
            ...state, lastCreatedNeighbourhoodCategoryId: action.payload.NeighbourhoodCategory.id
        });
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryUpdated: return adapter.updateOne(action.payload.partialNeighbourhoodCategory, state);
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryDeleted: return adapter.removeOne(action.payload.id, state);
        case NeighbourhoodCategoryActionTypes.AllNeighbourhoodCategorysLoaded: return adapter.addAll(action.payload.NeighbourhoodCategorys, {
            ...state, isAllNeighbourhoodCategorysLoaded: true
        });
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageLoaded: return adapter.addMany(action.payload.NeighbourhoodCategorys, {
            ...initialNeighbourhoodCategorysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.NeighbourhoodCategorys,
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
