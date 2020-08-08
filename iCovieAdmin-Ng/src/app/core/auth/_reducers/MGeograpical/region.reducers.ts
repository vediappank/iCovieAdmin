// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RegionActions, RegionActionTypes } from '../../_actions/MGeograpical/Region.actions';
// Models
import { MRegionModel } from '../../_models/MGeograpical/mRegion.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface RegionsState extends EntityState<MRegionModel> {
    isAllRegionsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MRegionModel[];
    lastCreatedRegionId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MRegionModel> = createEntityAdapter<MRegionModel>();

export const initialRegionsState: RegionsState = adapter.getInitialState({
    isAllRegionsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedRegionId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function RegionReducer(state = initialRegionsState, action: RegionActions): RegionsState {
    switch  (action.type) {
        case RegionActionTypes.RegionsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedRegionId: undefined
        };
        case RegionActionTypes.RegionsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case RegionActionTypes.RegionOnServerCreated: return {
            ...state
        };
        case RegionActionTypes.RegionCreated: return adapter.addOne(action.payload.Region, {
            ...state, lastCreatedRegionId: action.payload.Region.id
        });
        case RegionActionTypes.RegionUpdated: return adapter.updateOne(action.payload.partialRegion, state);
        case RegionActionTypes.RegionDeleted: return adapter.removeOne(action.payload.id, state);
        case RegionActionTypes.AllRegionsLoaded: return adapter.addAll(action.payload.Regions, {
            ...state, isAllRegionsLoaded: true
        });
        case RegionActionTypes.RegionsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case RegionActionTypes.RegionsPageLoaded: return adapter.addMany(action.payload.Regions, {
            ...initialRegionsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Regions,
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
