// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { StateActions, StateActionTypes } from '../../_actions/MGeograpical/State.actions';
// Models
import { MStateModel } from '../../_models/MGeograpical/mState.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface StatesState extends EntityState<MStateModel> {
    isAllStatesLoaded: boolean;
    queryRowsCount: number;
    queryResult: MStateModel[];
    lastCreatedStateId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MStateModel> = createEntityAdapter<MStateModel>();

export const initialStatesState: StatesState = adapter.getInitialState({
    isAllStatesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedStateId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function StateReducer(state = initialStatesState, action: StateActions): StatesState {
    switch  (action.type) {
        case StateActionTypes.StatesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedStateId: undefined
        };
        case StateActionTypes.StatesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case StateActionTypes.StateOnServerCreated: return {
            ...state
        };
        case StateActionTypes.StateCreated: return adapter.addOne(action.payload.State, {
            ...state, lastCreatedStateId: action.payload.State.id
        });
        case StateActionTypes.StateUpdated: return adapter.updateOne(action.payload.partialState, state);
        case StateActionTypes.StateDeleted: return adapter.removeOne(action.payload.id, state);
        case StateActionTypes.AllStatesLoaded: return adapter.addAll(action.payload.States, {
            ...state, isAllStatesLoaded: true
        });
        case StateActionTypes.StatesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case StateActionTypes.StatesPageLoaded: return adapter.addMany(action.payload.States, {
            ...initialStatesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.States,
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
