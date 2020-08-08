// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { BedTypeActions, BedTypeActionTypes } from '../../_actions/Masters/bedtype.actions';
// Models
import { BedTypeModel } from '../../_models/Masters/bedtype.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface BedTypesState extends EntityState<BedTypeModel> {
    isAllBedTypesLoaded: boolean;
    queryRowsCount: number;
    queryResult: BedTypeModel[];
    lastCreatedBedTypeId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<BedTypeModel> = createEntityAdapter<BedTypeModel>();

export const initialBedTypesState: BedTypesState = adapter.getInitialState({
    isAllBedTypesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedBedTypeId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function BedTypeReducer(state = initialBedTypesState, action: BedTypeActions): BedTypesState {
    switch  (action.type) {
        case BedTypeActionTypes.BedTypesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedBedTypeId: undefined
        };
        case BedTypeActionTypes.BedTypesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case BedTypeActionTypes.BedTypeOnServerCreated: return {
            ...state
        };
        case BedTypeActionTypes.BedTypeCreated: return adapter.addOne(action.payload.BedType, {
            ...state, lastCreatedBedTypeId: action.payload.BedType.id
        });
        case BedTypeActionTypes.BedTypeUpdated: return adapter.updateOne(action.payload.partialBedType, state);
        case BedTypeActionTypes.BedTypeDeleted: return adapter.removeOne(action.payload.id, state);
        case BedTypeActionTypes.AllBedTypesLoaded: return adapter.addAll(action.payload.BedTypes, {
            ...state, isAllBedTypesLoaded: true
        });
        case BedTypeActionTypes.BedTypesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case BedTypeActionTypes.BedTypesPageLoaded: return adapter.addMany(action.payload.BedTypes, {
            ...initialBedTypesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.BedTypes,
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
