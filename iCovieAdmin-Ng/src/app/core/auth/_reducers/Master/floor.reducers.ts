// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { FloorActions, FloorActionTypes } from '../../_actions/Master/floor.actions';
import { MFloorModel } from '../../_models/MFacilities/mfloor.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface FloorsState extends EntityState<MFloorModel> {
    isAllFloorsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MFloorModel[];
    lastCreatedFloorId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MFloorModel> = createEntityAdapter<MFloorModel>();

export const initialFloorsState: FloorsState = adapter.getInitialState({
    isAllFloorsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedFloorId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function FloorReducer(state = initialFloorsState, action: FloorActions): FloorsState {
    switch  (action.type) {
        case FloorActionTypes.FloorsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedFloorId: undefined
        };
        case FloorActionTypes.FloorsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case FloorActionTypes.FloorOnServerCreated: return {
            ...state
        };
        case FloorActionTypes.FloorCreated: return adapter.addOne(action.payload.Floor, {
            ...state, lastCreatedFloorId: action.payload.Floor.id
        });
        case FloorActionTypes.FloorUpdated: return adapter.updateOne(action.payload.partialFloor, state);
        case FloorActionTypes.FloorDeleted: return adapter.removeOne(action.payload.id, state);
        case FloorActionTypes.AllFloorsLoaded: return adapter.addAll(action.payload.Floors, {
            ...state, isAllFloorsLoaded: true
        });
        case FloorActionTypes.FloorsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case FloorActionTypes.FloorsPageLoaded: return adapter.addMany(action.payload.Floors, {
            ...initialFloorsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Floors,
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
