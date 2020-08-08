// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { SignupActions, SignupActionTypes } from '../../_actions/Masters/signup.actions';
// Models
import { SignupModel } from '../../_models/Masters/signup.model';
import { QueryParamsModel } from '../../../_base/crud';

export interface SignupsState extends EntityState<SignupModel> {
    isAllSignupsLoaded: boolean;
    queryRowsCount: number;
    queryResult: SignupModel[];
    lastCreatedSignupId: number;
    listLoading: boolean;
    actionsloading: boolean;
    lastQuery: QueryParamsModel;
    showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SignupModel> = createEntityAdapter<SignupModel>();

export const initialSignupsState: SignupsState = adapter.getInitialState({
    isAllSignupsLoaded: false,
    queryRowsCount: 0,
    queryResult: [],
    lastCreatedSignupId: undefined,
    listLoading: false,
    actionsloading: false,
    lastQuery: new QueryParamsModel({}),
    showInitWaitingMessage: true
});

export function SignupReducer(state = initialSignupsState, action: SignupActions): SignupsState {
    switch  (action.type) {
        case SignupActionTypes.SignupsPageToggleLoading: return {
                ...state, listLoading: action.payload.isLoading, lastCreatedSignupId: undefined
        };
        case SignupActionTypes.SignupsActionToggleLoading: return {
            ...state, actionsloading: action.payload.isLoading
        };
        case SignupActionTypes.SignupOnServerCreated: return {
            ...state
        };
        case SignupActionTypes.SignupCreated: return adapter.addOne(action.payload.Signup, {
            ...state, lastCreatedSignupId: action.payload.Signup.id
        });
        case SignupActionTypes.SignupUpdated: return adapter.updateOne(action.payload.partialSignup, state);
        case SignupActionTypes.SignupDeleted: return adapter.removeOne(action.payload.id, state);
        case SignupActionTypes.AllSignupsLoaded: return adapter.addAll(action.payload.Signups, {
            ...state, isAllSignupsLoaded: true
        });
        case SignupActionTypes.SignupsPageCancelled: return {
            ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
        };
        case SignupActionTypes.SignupsPageLoaded: return adapter.addMany(action.payload.Signups, {
            ...initialSignupsState,
            listLoading: false,
            queryRowsCount: action.payload.totalCount,
            queryResult: action.payload.Signups,
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
