// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { PropertyActions, PropertyActionTypes } from '../../_actions/Masters/property.actions';
// Models
import { PropertyModel } from '../../_models/Masters/property.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface PropertysState extends EntityState<PropertyModel> {
    isAllPropertysLoaded: boolean;
    queryRowsCount: number;
    queryResult: PropertyModel[];
    lastCreatedPropertyId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<PropertyModel> = createEntityAdapter<PropertyModel>();

export const initialPropertysState: PropertysState = adapter.getInitialState({
    isAllPropertysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedPropertyId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function PropertyReducer(state = initialPropertysState, action: PropertyActions): PropertysState {
    switch  (action.type) {
        case PropertyActionTypes.PropertysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedPropertyId: undefined
        };
        case PropertyActionTypes.PropertysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case PropertyActionTypes.PropertyOnServerCreated: return {
            ...state
        };
        case PropertyActionTypes.PropertyCreated: return adapter.addOne(action.payload.Property, {
            ...state, lastCreatedPropertyId: action.payload.Property.id
        });
        case PropertyActionTypes.PropertyUpdated: return adapter.updateOne(action.payload.partialProperty, state);
        case PropertyActionTypes.PropertyDeleted: return adapter.removeOne(action.payload.id, state);
        case PropertyActionTypes.AllPropertysLoaded: return adapter.addAll(action.payload.Propertys, {
            ...state, isAllPropertysLoaded: true
        });
        case PropertyActionTypes.PropertysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case PropertyActionTypes.PropertysPageLoaded: return adapter.addMany(action.payload.Propertys, {
            ...initialPropertysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Propertys,
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
