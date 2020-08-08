// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CountryActions, CountryActionTypes } from '../../_actions/MGeograpical/Country.actions';
// Models
import { MCountryModel } from '../../_models/MGeograpical/mCountry.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface CountrysState extends EntityState<MCountryModel> {
    isAllCountrysLoaded: boolean;
    queryRowsCount: number;
    queryResult: MCountryModel[];
    lastCreatedCountryId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<MCountryModel> = createEntityAdapter<MCountryModel>();

export const initialCountrysState: CountrysState = adapter.getInitialState({
    isAllCountrysLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedCountryId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function CountryReducer(state = initialCountrysState, action: CountryActions): CountrysState {
    switch  (action.type) {
        case CountryActionTypes.CountrysPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedCountryId: undefined
        };
        case CountryActionTypes.CountrysActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case CountryActionTypes.CountryOnServerCreated: return {
            ...state
        };
        case CountryActionTypes.CountryCreated: return adapter.addOne(action.payload.Country, {
            ...state, lastCreatedCountryId: action.payload.Country.id
        });
        case CountryActionTypes.CountryUpdated: return adapter.updateOne(action.payload.partialCountry, state);
        case CountryActionTypes.CountryDeleted: return adapter.removeOne(action.payload.id, state);
        case CountryActionTypes.AllCountrysLoaded: return adapter.addAll(action.payload.Countrys, {
            ...state, isAllCountrysLoaded: true
        });
        case CountryActionTypes.CountrysPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case CountryActionTypes.CountrysPageLoaded: return adapter.addMany(action.payload.Countrys, {
            ...initialCountrysState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Countrys,
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
