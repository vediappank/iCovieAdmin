// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AminitiesActions, AminitiesActionTypes } from '../../_actions/Masters/aminities.actions';
// Models
import { AminitiesModel } from '../../_models/Masters/aminities.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface AminitiessState extends EntityState<AminitiesModel> {
    isAllAminitiessLoaded: boolean;
    queryRowsCount: number;
    queryResult: AminitiesModel[];
    lastCreatedAminitiesId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AminitiesModel> = createEntityAdapter<AminitiesModel>();

export const initialAminitiessState: AminitiessState = adapter.getInitialState({
    isAllAminitiessLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedAminitiesId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function AminitiesReducer(state = initialAminitiessState, action: AminitiesActions): AminitiessState {
    switch  (action.type) {
        case AminitiesActionTypes.AminitiessPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedAminitiesId: undefined
        };
        case AminitiesActionTypes.AminitiessActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case AminitiesActionTypes.AminitiesOnServerCreated: return {
            ...state
        };
        case AminitiesActionTypes.AminitiesCreated: return adapter.addOne(action.payload.Aminities, {
            ...state, lastCreatedAminitiesId: action.payload.Aminities.id
        });
        case AminitiesActionTypes.AminitiesUpdated: return adapter.updateOne(action.payload.partialAminities, state);
        case AminitiesActionTypes.AminitiesDeleted: return adapter.removeOne(action.payload.id, state);
        case AminitiesActionTypes.AllAminitiessLoaded: return adapter.addAll(action.payload.Aminitiess, {
            ...state, isAllAminitiessLoaded: true
        });
        case AminitiesActionTypes.AminitiessPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case AminitiesActionTypes.AminitiessPageLoaded: return adapter.addMany(action.payload.Aminitiess, {
            ...initialAminitiessState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Aminitiess,
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
