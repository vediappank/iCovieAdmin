// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { BuildingActions, BuildingActionTypes } from '../../_actions/Master/building.actions';
import { MBuildingModel } from '../../_models/MFacilities/mbuilding.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface BuildingsState extends EntityState<MBuildingModel> {
    isAllBuildingsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MBuildingModel[];
    lastCreatedBuildingId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MBuildingModel> = createEntityAdapter<MBuildingModel>();

export const initialBuildingsState: BuildingsState = adapter.getInitialState({
    isAllBuildingsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedBuildingId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function BuildingReducer(state = initialBuildingsState, action: BuildingActions): BuildingsState {
    switch  (action.type) {
        case BuildingActionTypes.BuildingsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedBuildingId: undefined
        };
        case BuildingActionTypes.BuildingsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case BuildingActionTypes.BuildingOnServerCreated: return {
            ...state
        };
        case BuildingActionTypes.BuildingCreated: return adapter.addOne(action.payload.Building, {
            ...state, lastCreatedBuildingId: action.payload.Building.id
        });
        case BuildingActionTypes.BuildingUpdated: return adapter.updateOne(action.payload.partialBuilding, state);
        case BuildingActionTypes.BuildingDeleted: return adapter.removeOne(action.payload.id, state);
        case BuildingActionTypes.AllBuildingsLoaded: return adapter.addAll(action.payload.Buildings, {
            ...state, isAllBuildingsLoaded: true
        });
        case BuildingActionTypes.BuildingsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case BuildingActionTypes.BuildingsPageLoaded: return adapter.addMany(action.payload.Buildings, {
            ...initialBuildingsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Buildings,
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
