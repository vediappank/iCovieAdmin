// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { LocationActions, LocationActionTypes } from '../../_actions/Master/location.action';
import { MLocationModel } from '../../_models/MFacilities/mlocation.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface LocationsState extends EntityState<MLocationModel> {
    isAllLocationsLoaded: boolean;
    queryRowsCount: number;
    queryResult: MLocationModel[];
    lastCreatedLocationId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MLocationModel> = createEntityAdapter<MLocationModel>();

export const initialLocationsState: LocationsState = adapter.getInitialState({
    isAllLocationsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedLocationId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function LocationReducer(state = initialLocationsState, action: LocationActions): LocationsState {
    switch  (action.type) {
        case LocationActionTypes.LocationsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedLocationId: undefined
        };
        case LocationActionTypes.LocationsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case LocationActionTypes.LocationOnServerCreated: return {
            ...state
        };
        case LocationActionTypes.LocationCreated: return adapter.addOne(action.payload.Location, {
            ...state, lastCreatedLocationId: action.payload.Location.id
        });
        case LocationActionTypes.LocationUpdated: return adapter.updateOne(action.payload.partialLocation, state);
        case LocationActionTypes.LocationDeleted: return adapter.removeOne(action.payload.id, state);
        case LocationActionTypes.AllLocationsLoaded: return adapter.addAll(action.payload.Locations, {
            ...state, isAllLocationsLoaded: true
        });
        case LocationActionTypes.LocationsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case LocationActionTypes.LocationsPageLoaded: return adapter.addMany(action.payload.Locations, {
            ...initialLocationsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Locations,
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
