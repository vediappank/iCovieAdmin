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
import { allTimeZonesLoaded } from '../../_selectors/MGeograpical/TimeZone.selectors';
// Actions
import {
    AllTimeZonesLoaded,
    AllTimeZonesRequested,
    TimeZoneActionTypes,
    TimeZonesPageRequested,
    TimeZonesPageLoaded,
    TimeZoneUpdated,
    TimeZonesPageToggleLoading,
    TimeZoneDeleted,
    TimeZoneOnServerCreated,
    TimeZoneCreated,
    TimeZonesActionToggleLoading
} from '../../_actions/MGeograpical/TimeZone.actions'

@Injectable()
export class TimeZoneEffects {
    showPageLoadingDistpatcher = new TimeZonesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new TimeZonesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new TimeZonesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new TimeZonesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllTimeZones$ = this.actions$
        .pipe(
            ofType<AllTimeZonesRequested>(TimeZoneActionTypes.AllTimeZonesRequested),
            withLatestFrom(this.store.pipe(select(allTimeZonesLoaded))),
            filter(([action, isAllTimeZonesLoaded]) => !isAllTimeZonesLoaded),
            mergeMap(() => this.auth.GetALLTimeZone()),
            map(TimeZones => {                             
                return new AllTimeZonesLoaded({TimeZones});
            })
          );

    @Effect()
    loadTimeZonesPage$ = this.actions$
        .pipe(
            ofType<TimeZonesPageRequested>(TimeZoneActionTypes.TimeZonesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findTimeZones called ');
                
                const requestToServer = this.auth.findTimeZone(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new TimeZonesPageLoaded({
                    TimeZones: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteTimeZone$ = this.actions$
        .pipe(
            ofType<TimeZoneDeleted>(TimeZoneActionTypes.TimeZoneDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteTimeZone(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateTimeZone$ = this.actions$
        .pipe(
            ofType<TimeZoneUpdated>(TimeZoneActionTypes.TimeZoneUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateTimeZone(payload.TimeZone);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createTimeZone$ = this.actions$
        .pipe(
            ofType<TimeZoneOnServerCreated>(TimeZoneActionTypes.TimeZoneOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createTimeZone(payload.TimeZone).pipe(
                    tap(res => {
                        this.store.dispatch(new TimeZoneCreated({ TimeZone: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllTimeZonesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
