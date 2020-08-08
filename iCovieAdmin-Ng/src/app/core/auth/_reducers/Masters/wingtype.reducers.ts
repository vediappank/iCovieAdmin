// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { WingTypeActions, WingTypeActionTypes } from '../../_actions/Masters/wingtype.actions';
// Models
import { WingTypeModel } from '../../_models/Masters/wingtype.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface WingTypesState extends EntityState<WingTypeModel> {
    isAllWingTypesLoaded: boolean;
    queryRowsCount: number;
    queryResult: WingTypeModel[];
    lastCreatedWingTypeId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<WingTypeModel> = createEntityAdapter<WingTypeModel>();

export const initialWingTypesState: WingTypesState = adapter.getInitialState({
    isAllWingTypesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedWingTypeId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function WingTypeReducer(state = initialWingTypesState, action: WingTypeActions): WingTypesState {
    switch  (action.type) {
        case WingTypeActionTypes.WingTypesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedWingTypeId: undefined
        };
        case WingTypeActionTypes.WingTypesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case WingTypeActionTypes.WingTypeOnServerCreated: return {
            ...state
        };
        case WingTypeActionTypes.WingTypeCreated: return adapter.addOne(action.payload.WingType, {
            ...state, lastCreatedWingTypeId: action.payload.WingType.id
        });
        case WingTypeActionTypes.WingTypeUpdated: return adapter.updateOne(action.payload.partialWingType, state);
        case WingTypeActionTypes.WingTypeDeleted: return adapter.removeOne(action.payload.id, state);
        case WingTypeActionTypes.AllWingTypesLoaded: return adapter.addAll(action.payload.WingTypes, {
            ...state, isAllWingTypesLoaded: true
        });
        case WingTypeActionTypes.WingTypesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case WingTypeActionTypes.WingTypesPageLoaded: return adapter.addMany(action.payload.WingTypes, {
            ...initialWingTypesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.WingTypes,
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
