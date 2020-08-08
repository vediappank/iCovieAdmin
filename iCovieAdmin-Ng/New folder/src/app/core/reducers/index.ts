// NGRX
import { ActionReducerMap, MetaReducer, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { storeLogger } from 'ngrx-store-logger';

import { environment } from '../../../environments/environment';

// tslint:disable-next-line:no-empty-interface
export interface AppState {
  router: RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer
};

export function logger(reducer: ActionReducer<AppState>): any {
    // default, no options
    return storeLogger()(reducer);
  }

// export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze, logger] : [];
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
