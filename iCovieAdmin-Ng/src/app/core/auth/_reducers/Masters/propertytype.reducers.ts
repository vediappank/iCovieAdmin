// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { PropertyTypeActions, PropertyTypeActionTypes } from '../../_actions/Masters/propertytype.actions';
// Models
import { PropertyTypeModel } from '../../_models/Masters/propertytype.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface PropertyTypesState extends EntityState<PropertyTypeModel> {
    isAllPropertyTypesLoaded: boolean;
    queryRowsCount: number;
    queryResult: PropertyTypeModel[];
    lastCreatedPropertyTypeId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<PropertyTypeModel> = createEntityAdapter<PropertyTypeModel>();

export const initialPropertyTypesState: PropertyTypesState = adapter.getInitialState({
    isAllPropertyTypesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedPropertyTypeId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function PropertyTypeReducer(state = initialPropertyTypesState, action: PropertyTypeActions): PropertyTypesState {
    switch  (action.type) {
        case PropertyTypeActionTypes.PropertyTypesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedPropertyTypeId: undefined
        };
        case PropertyTypeActionTypes.PropertyTypesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case PropertyTypeActionTypes.PropertyTypeOnServerCreated: return {
            ...state
        };
        case PropertyTypeActionTypes.PropertyTypeCreated: return adapter.addOne(action.payload.PropertyType, {
            ...state, lastCreatedPropertyTypeId: action.payload.PropertyType.id
        });
        case PropertyTypeActionTypes.PropertyTypeUpdated: return adapter.updateOne(action.payload.partialPropertyType, state);
        case PropertyTypeActionTypes.PropertyTypeDeleted: return adapter.removeOne(action.payload.id, state);
        case PropertyTypeActionTypes.AllPropertyTypesLoaded: return adapter.addAll(action.payload.PropertyTypes, {
            ...state, isAllPropertyTypesLoaded: true
        });
        case PropertyTypeActionTypes.PropertyTypesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case PropertyTypeActionTypes.PropertyTypesPageLoaded: return adapter.addMany(action.payload.PropertyTypes, {
            ...initialPropertyTypesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.PropertyTypes,
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
