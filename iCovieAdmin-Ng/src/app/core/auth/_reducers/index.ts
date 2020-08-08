import * as AuthReducers from './auth.reducers';
import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../reducers';


export const authFeatureKey = 'auth';

export interface AuthState {
  [AuthReducers.statusFeatureKey]: AuthReducers.State;
}

export interface State extends AppState {
  [authFeatureKey]: AuthState;
}

export function reducers(state: AuthState | undefined, action: Action) {
    return combineReducers({
      [AuthReducers.statusFeatureKey]: AuthReducers.reducer
    })(state, action);
}

export const selectAuthState = createFeatureSelector<State, AuthState>(
    authFeatureKey
);

export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);

export const selectUser = createSelector(
  selectAuthStatusState,
  AuthReducers.getUser
);

export const isUserLoggedIn = createSelector(selectAuthStatusState, state => state.isUserLoaded );

export { AuthReducers };
