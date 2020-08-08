// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { PropertyCategoryActions, PropertyCategoryActionTypes } from '../../_actions/Masters/propertycategory.actions';
// Models
import { PropertyCategoryModel } from '../../_models/Masters/propertycategory.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface PropertyCategorysState extends EntityState<PropertyCategoryModel> {
    isAllPropertyCategorysLoaded: boolean;
    queryRowsCount: number;
    queryResult: PropertyCategoryModel[];
    lastCreatedPropertyCategoryId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<PropertyCategoryModel> = createEntityAdapter<PropertyCategoryModel>();

export const initialPropertyCategorysState: PropertyCategorysState = adapter.getInitialState({
    isAllPropertyCategorysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedPropertyCategoryId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function PropertyCategoryReducer(state = initialPropertyCategorysState, action: PropertyCategoryActions): PropertyCategorysState {
    switch  (action.type) {
        case PropertyCategoryActionTypes.PropertyCategorysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedPropertyCategoryId: undefined
        };
        case PropertyCategoryActionTypes.PropertyCategorysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case PropertyCategoryActionTypes.PropertyCategoryOnServerCreated: return {
            ...state
        };
        case PropertyCategoryActionTypes.PropertyCategoryCreated: return adapter.addOne(action.payload.PropertyCategory, {
            ...state, lastCreatedPropertyCategoryId: action.payload.PropertyCategory.id
        });
        case PropertyCategoryActionTypes.PropertyCategoryUpdated: return adapter.updateOne(action.payload.partialPropertyCategory, state);
        case PropertyCategoryActionTypes.PropertyCategoryDeleted: return adapter.removeOne(action.payload.id, state);
        case PropertyCategoryActionTypes.AllPropertyCategorysLoaded: return adapter.addAll(action.payload.PropertyCategorys, {
            ...state, isAllPropertyCategorysLoaded: true
        });
        case PropertyCategoryActionTypes.PropertyCategorysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case PropertyCategoryActionTypes.PropertyCategorysPageLoaded: return adapter.addMany(action.payload.PropertyCategorys, {
            ...initialPropertyCategorysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.PropertyCategorys,
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
