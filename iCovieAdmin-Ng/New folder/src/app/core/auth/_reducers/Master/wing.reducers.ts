// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { WingActions, WingActionTypes } from '../../_actions/Master/Wing.actions';
import { MWingModel } from '../../_models/MFacilities/mwing.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface WingsState extends EntityState<MWingModel> {
    isAllWingsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MWingModel[];
    lastCreatedWingId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MWingModel> = createEntityAdapter<MWingModel>();

export const initialWingsState: WingsState = adapter.getInitialState({
    isAllWingsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedWingId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function WingReducer(state = initialWingsState, action: WingActions): WingsState {
    switch  (action.type) {
        case WingActionTypes.WingsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedWingId: undefined
        };
        case WingActionTypes.WingsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case WingActionTypes.WingOnServerCreated: return {
            ...state
        };
        case WingActionTypes.WingCreated: return adapter.addOne(action.payload.Wing, {
            ...state, lastCreatedWingId: action.payload.Wing.id
        });
        case WingActionTypes.WingUpdated: return adapter.updateOne(action.payload.partialWing, state);
        case WingActionTypes.WingDeleted: return adapter.removeOne(action.payload.id, state);
        case WingActionTypes.AllWingsLoaded: return adapter.addAll(action.payload.Wings, {
            ...state, isAllWingsLoaded: true
        });
        case WingActionTypes.WingsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case WingActionTypes.WingsPageLoaded: return adapter.addMany(action.payload.Wings, {
            ...initialWingsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Wings,
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
