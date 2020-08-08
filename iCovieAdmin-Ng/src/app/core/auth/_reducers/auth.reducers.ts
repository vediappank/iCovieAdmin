// Actions

// Models
import { User } from '../_models/MAdministrator/user.model';
import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import { AuthActions } from '../_actions';

export const statusFeatureKey = 'status';

export interface State {
    loggedIn: boolean;
    authToken: string;
    user: User | null;
    isUserLoaded: boolean;
}

export const initialAuthState: State = {
    loggedIn: false,
    authToken: undefined,
    user: null,
    isUserLoaded: false
};

export const reducer = createReducer(
    initialAuthState,
    on( AuthActions.login, (state, {authToken} ) => ({
        loggedIn: true,
        authToken: '' + authToken,
        user: null,
        isUserLoaded: false
    })),
    on( AuthActions.logout, () => initialAuthState ),
    on( AuthActions.userLoaded, (state, { user } ) => ({
        ...state,
        user,
        isUserLoaded: true
    })),
    on( AuthActions.register, (state, {authToken} ) => ({
        loggedIn: true,
        authToken: '' + authToken,
        user: null,
        isUserLoaded: false
    }))
);

export const getAuthState = createFeatureSelector<State>(
    'auth'
);

export const getUser = (state: State) => state.user;
export const getLoggedIn = (state: State) => state.loggedIn;
export const getAuthToken = (state: State) => state.authToken;
export const getIsUserLoaded = (state: State) => state.isUserLoaded;

/*export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    console.log('Authentication Reducer::Action: ' + JSON.stringify(action.type) );
    switch (action.type) {
        case AuthActionTypes.Login: {
            const _token: string = action.payload.authToken;
            return {
                loggedIn: true,
                authToken: _token,
                user: undefined,
                isUserLoaded: false
            };
        }

        case AuthActionTypes.Register: {
            const _token: string = action.payload.authToken;
            return {
                loggedIn: true,
                authToken: _token,
                user: undefined,
                isUserLoaded: false
            };
        }

        case AuthActionTypes.Logout:
            return initialAuthState;

        case AuthActionTypes.UserLoaded: {
            const _user: User = action.payload.user;
            return {
                ...state,
                user: _user,
                isUserLoaded: true
            };
        }

        default:
            return state;
    }
}*/
