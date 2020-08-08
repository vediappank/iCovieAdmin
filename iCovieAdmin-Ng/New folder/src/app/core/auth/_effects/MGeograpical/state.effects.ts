// Angular
import { Injectable } from '@angular/core';
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../../_base/crud';
// Services
import { AuthService } from '../../_services';
// State
import { AppState } from '../../../../core/reducers';
// Selectors
import { allStatesLoaded } from '../../_selectors/MGeograpical/State.selectors';
// Actions
import {
    AllStatesLoaded,
    AllStatesRequested,
    StateActionTypes,
    StatesPageRequested,
    StatesPageLoaded,
    StateUpdated,
    StatesPageToggleLoading,
    StateDeleted,
    StateOnServerCreated,
    StateCreated,
    StatesActionToggleLoading
} from '../../_actions/MGeograpical/state.actions';

@Injectable()
export class StateEffects {
    showPageLoadingDistpatcher = new StatesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new StatesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new StatesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new StatesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllStates$ = this.actions$
        .pipe(
            ofType<AllStatesRequested>(StateActionTypes.AllStatesRequested),
            withLatestFrom(this.store.pipe(select(allStatesLoaded))),
            filter(([action, isAllStatesLoaded]) => !isAllStatesLoaded),
            mergeMap(() => this.auth.GetALLState()),
            map(States => {                             
                return new AllStatesLoaded({States});
            })
          );

    @Effect()
    loadStatesPage$ = this.actions$
        .pipe(
            ofType<StatesPageRequested>(StateActionTypes.StatesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findStates called ');
                
                const requestToServer = this.auth.findState(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new StatesPageLoaded({
                    States: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteState$ = this.actions$
        .pipe(
            ofType<StateDeleted>(StateActionTypes.StateDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteState(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateState$ = this.actions$
        .pipe(
            ofType<StateUpdated>(StateActionTypes.StateUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateState(payload.State);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createState$ = this.actions$
        .pipe(
            ofType<StateOnServerCreated>(StateActionTypes.StateOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createState(payload.State).pipe(
                    tap(res => {
                        this.store.dispatch(new StateCreated({ State: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllStatesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
