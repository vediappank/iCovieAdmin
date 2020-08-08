// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CityActions, CityActionTypes } from '../../_actions/MGeograpical/City.actions';
// Models
import { MCityModel } from '../../_models/MGeograpical/mCity.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface CitysState extends EntityState<MCityModel> {
    isAllCitysLoaded: boolean;
    queryRowsCount: number;
    queryResult: MCityModel[];
    lastCreatedCityId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MCityModel> = createEntityAdapter<MCityModel>();

export const initialCitysState: CitysState = adapter.getInitialState({
    isAllCitysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedCityId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function CityReducer(state = initialCitysState, action: CityActions): CitysState {
    switch  (action.type) {
        case CityActionTypes.CitysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedCityId: undefined
        };
        case CityActionTypes.CitysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CityActionTypes.CityOnServerCreated: return {
            ...state
        };
        case CityActionTypes.CityCreated: return adapter.addOne(action.payload.City, {
            ...state, lastCreatedCityId: action.payload.City.id
        });
        case CityActionTypes.CityUpdated: return adapter.updateOne(action.payload.partialCity, state);
        case CityActionTypes.CityDeleted: return adapter.removeOne(action.payload.id, state);
        case CityActionTypes.AllCitysLoaded: return adapter.addAll(action.payload.Citys, {
            ...state, isAllCitysLoaded: true
        });
        case CityActionTypes.CitysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CityActionTypes.CitysPageLoaded: return adapter.addMany(action.payload.Citys, {
            ...initialCitysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Citys,
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
