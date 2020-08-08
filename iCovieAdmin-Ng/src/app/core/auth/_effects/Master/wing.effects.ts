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
import { allWingsLoaded } from '../../_selectors/Master/wing.selectors';
// Actions
import {
    AllWingsLoaded,
    AllWingsRequested,
    WingActionTypes,
    WingsPageRequested,
    WingsPageLoaded,
    WingUpdated,
    WingsPageToggleLoading,
    WingDeleted,
    WingOnServerCreated,
    WingCreated,
    WingsActionToggleLoading
} from '../../_actions/Master/Wing.actions'

@Injectable()
export class WingEffects {
    showPageLoadingDistpatcher = new WingsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new WingsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new WingsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new WingsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllWings$ = this.actions$
        .pipe(
            ofType<AllWingsRequested>(WingActionTypes.AllWingsRequested),
            withLatestFrom(this.store.pipe(select(allWingsLoaded))),
            filter(([action, isAllWingsLoaded]) => !isAllWingsLoaded),
            mergeMap(() => this.auth.GetALLWing()),
            map(Wings => {                             
                return new AllWingsLoaded({Wings});
            })
          );

    @Effect()
    loadWingsPage$ = this.actions$
        .pipe(
            ofType<WingsPageRequested>(WingActionTypes.WingsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findWings called ');
                
                const requestToServer = this.auth.findWing(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new WingsPageLoaded({
                    Wings: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteWing$ = this.actions$
        .pipe(
            ofType<WingDeleted>(WingActionTypes.WingDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteWing(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateWing$ = this.actions$
        .pipe(
            ofType<WingUpdated>(WingActionTypes.WingUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateWing(payload.Wing);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createWing$ = this.actions$
        .pipe(
            ofType<WingOnServerCreated>(WingActionTypes.WingOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createWing(payload.Wing).pipe(
                    tap(res => {
                        this.store.dispatch(new WingCreated({ Wing: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllWingsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
