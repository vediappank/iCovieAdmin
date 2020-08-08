// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { TimeZoneActions, TimeZoneActionTypes } from '../../_actions/MGeograpical/TimeZone.actions';
// Models
import { MTimeZoneModel } from '../../_models/MGeograpical/mTimeZone.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface TimeZonesState extends EntityState<MTimeZoneModel> {
    isAllTimeZonesLoaded: boolean;
    queryRowsCount: number;
    queryResult: MTimeZoneModel[];
    lastCreatedTimeZoneId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MTimeZoneModel> = createEntityAdapter<MTimeZoneModel>();

export const initialTimeZonesState: TimeZonesState = adapter.getInitialState({
    isAllTimeZonesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedTimeZoneId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function TimeZoneReducer(state = initialTimeZonesState, action: TimeZoneActions): TimeZonesState {
    switch  (action.type) {
        case TimeZoneActionTypes.TimeZonesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedTimeZoneId: undefined
        };
        case TimeZoneActionTypes.TimeZonesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case TimeZoneActionTypes.TimeZoneOnServerCreated: return {
            ...state
        };
        case TimeZoneActionTypes.TimeZoneCreated: return adapter.addOne(action.payload.TimeZone, {
            ...state, lastCreatedTimeZoneId: action.payload.TimeZone.id
        });
        case TimeZoneActionTypes.TimeZoneUpdated: return adapter.updateOne(action.payload.partialTimeZone, state);
        case TimeZoneActionTypes.TimeZoneDeleted: return adapter.removeOne(action.payload.id, state);
        case TimeZoneActionTypes.AllTimeZonesLoaded: return adapter.addAll(action.payload.TimeZones, {
            ...state, isAllTimeZonesLoaded: true
        });
        case TimeZoneActionTypes.TimeZonesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case TimeZoneActionTypes.TimeZonesPageLoaded: return adapter.addMany(action.payload.TimeZones, {
            ...initialTimeZonesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.TimeZones,
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
