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
import { allFloorsLoaded } from '../../_selectors/Master/floor.selectors';
// Actions
import {
    AllFloorsLoaded,
    AllFloorsRequested,
    FloorActionTypes,
    FloorsPageRequested,
    FloorsPageLoaded,
    FloorUpdated,
    FloorsPageToggleLoading,
    FloorDeleted,
    FloorOnServerCreated,
    FloorCreated,
    FloorsActionToggleLoading
} from '../../_actions/Master/Floor.actions'

@Injectable()
export class FloorEffects {
    showPageLoadingDistpatcher = new FloorsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new FloorsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new FloorsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new FloorsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllFloors$ = this.actions$
        .pipe(
            ofType<AllFloorsRequested>(FloorActionTypes.AllFloorsRequested),
            withLatestFrom(this.store.pipe(select(allFloorsLoaded))),
            filter(([action, isAllFloorsLoaded]) => !isAllFloorsLoaded),
            mergeMap(() => this.auth.GetALLFloor()),
            map(Floors => {                             
                return new AllFloorsLoaded({Floors});
            })
          );

    @Effect()
    loadFloorsPage$ = this.actions$
        .pipe(
            ofType<FloorsPageRequested>(FloorActionTypes.FloorsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findFloors called ');
                
                const requestToServer = this.auth.findFloor(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new FloorsPageLoaded({
                    Floors: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteFloor$ = this.actions$
        .pipe(
            ofType<FloorDeleted>(FloorActionTypes.FloorDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteFloor(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateFloor$ = this.actions$
        .pipe(
            ofType<FloorUpdated>(FloorActionTypes.FloorUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateFloor(payload.Floor);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createFloor$ = this.actions$
        .pipe(
            ofType<FloorOnServerCreated>(FloorActionTypes.FloorOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createFloor(payload.Floor).pipe(
                    tap(res => {
                        this.store.dispatch(new FloorCreated({ Floor: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllFloorsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
