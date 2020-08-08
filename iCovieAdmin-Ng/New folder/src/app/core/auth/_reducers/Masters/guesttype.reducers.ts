// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { GuestTypeActions, GuestTypeActionTypes } from '../../_actions/Masters/guesttype.actions';
// Models
import { GuestTypeModel } from '../../_models/Masters/guesttype.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface GuestTypesState extends EntityState<GuestTypeModel> {
    isAllGuestTypesLoaded: boolean;
    queryRowsCount: number;
    queryResult: GuestTypeModel[];
    lastCreatedGuestTypeId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<GuestTypeModel> = createEntityAdapter<GuestTypeModel>();

export const initialGuestTypesState: GuestTypesState = adapter.getInitialState({
    isAllGuestTypesLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedGuestTypeId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function GuestTypeReducer(state = initialGuestTypesState, action: GuestTypeActions): GuestTypesState {
    switch  (action.type) {
        case GuestTypeActionTypes.GuestTypesPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedGuestTypeId: undefined
        };
        case GuestTypeActionTypes.GuestTypesActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case GuestTypeActionTypes.GuestTypeOnServerCreated: return {
            ...state
        };
        case GuestTypeActionTypes.GuestTypeCreated: return adapter.addOne(action.payload.GuestType, {
            ...state, lastCreatedGuestTypeId: action.payload.GuestType.id
        });
        case GuestTypeActionTypes.GuestTypeUpdated: return adapter.updateOne(action.payload.partialGuestType, state);
        case GuestTypeActionTypes.GuestTypeDeleted: return adapter.removeOne(action.payload.id, state);
        case GuestTypeActionTypes.AllGuestTypesLoaded: return adapter.addAll(action.payload.GuestTypes, {
            ...state, isAllGuestTypesLoaded: true
        });
        case GuestTypeActionTypes.GuestTypesPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case GuestTypeActionTypes.GuestTypesPageLoaded: return adapter.addMany(action.payload.GuestTypes, {
            ...initialGuestTypesState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.GuestTypes,
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
