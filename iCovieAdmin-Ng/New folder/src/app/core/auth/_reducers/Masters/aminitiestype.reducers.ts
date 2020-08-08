// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AminitiesTypeActions, AminitiesTypeActionTypes } from '../../_actions/Masters/aminitiestype.actions';
// Models
import { AminitiesTypeModel } from '../../_models/Masters/aminitiestype.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface AminitiesTypesState extends EntityState<AminitiesTypeModel> {
    isAllAminitiesTypesLoaded: boolean;
    queryRowsCount: number;
    queryResult: AminitiesTypeModel[];
    lastCreatedAminitiesTypeId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AminitiesTypeModel> = createEntityAdapter<AminitiesTypeModel>();

export const initialAminitiesTypesState: AminitiesTypesState = adapter.getInitialState({
    isAllAminitiesTypesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedAminitiesTypeId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function AminitiesTypeReducer(state = initialAminitiesTypesState, action: AminitiesTypeActions): AminitiesTypesState {
    switch  (action.type) {
        case AminitiesTypeActionTypes.AminitiesTypesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedAminitiesTypeId: undefined
        };
        case AminitiesTypeActionTypes.AminitiesTypesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case AminitiesTypeActionTypes.AminitiesTypeOnServerCreated: return {
            ...state
        };
        case AminitiesTypeActionTypes.AminitiesTypeCreated: return adapter.addOne(action.payload.AminitiesType, {
            ...state, lastCreatedAminitiesTypeId: action.payload.AminitiesType.id
        });
        case AminitiesTypeActionTypes.AminitiesTypeUpdated: return adapter.updateOne(action.payload.partialAminitiesType, state);
        case AminitiesTypeActionTypes.AminitiesTypeDeleted: return adapter.removeOne(action.payload.id, state);
        case AminitiesTypeActionTypes.AllAminitiesTypesLoaded: return adapter.addAll(action.payload.AminitiesTypes, {
            ...state, isAllAminitiesTypesLoaded: true
        });
        case AminitiesTypeActionTypes.AminitiesTypesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case AminitiesTypeActionTypes.AminitiesTypesPageLoaded: return adapter.addMany(action.payload.AminitiesTypes, {
            ...initialAminitiesTypesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.AminitiesTypes,
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
