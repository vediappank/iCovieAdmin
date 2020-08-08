// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { AminitiesNeighbourhoodActions, AminitiesNeighbourhoodActionTypes } from '../../_actions/Masters/aminitiesneighbourhood.actions';
// Models
import { AminitiesNeighbourhoodModel } from '../../_models/Masters/aminitiesneighbourhood.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface AminitiesNeighbourhoodsState extends EntityState<AminitiesNeighbourhoodModel> {
    isAllAminitiesNeighbourhoodsLoaded: boolean;
    queryRowsCount: number;
    queryResult: AminitiesNeighbourhoodModel[];
    lastCreatedAminitiesNeighbourhoodId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AminitiesNeighbourhoodModel> = createEntityAdapter<AminitiesNeighbourhoodModel>();

export const initialAminitiesNeighbourhoodsState: AminitiesNeighbourhoodsState = adapter.getInitialState({
    isAllAminitiesNeighbourhoodsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedAminitiesNeighbourhoodId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function AminitiesNeighbourhoodReducer(state = initialAminitiesNeighbourhoodsState, action: AminitiesNeighbourhoodActions): AminitiesNeighbourhoodsState {
    switch  (action.type) {
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedAminitiesNeighbourhoodId: undefined
        };
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodOnServerCreated: return {
            ...state
        };
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodCreated: return adapter.addOne(action.payload.AminitiesNeighbourhood, {
            ...state, lastCreatedAminitiesNeighbourhoodId: action.payload.AminitiesNeighbourhood.id
        });
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodUpdated: return adapter.updateOne(action.payload.partialAminitiesNeighbourhood, state);
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodDeleted: return adapter.removeOne(action.payload.id, state);
        case AminitiesNeighbourhoodActionTypes.AllAminitiesNeighbourhoodsLoaded: return adapter.addAll(action.payload.AminitiesNeighbourhoods, {
            ...state, isAllAminitiesNeighbourhoodsLoaded: true
        });
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageLoaded: return adapter.addMany(action.payload.AminitiesNeighbourhoods, {
            ...initialAminitiesNeighbourhoodsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.AminitiesNeighbourhoods,
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
