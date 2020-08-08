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
import { allLocationsLoaded } from '../../_selectors/Master/location.selectors';
// Actions
import {
    AllLocationsLoaded,
    AllLocationsRequested,
    LocationActionTypes,
    LocationsPageRequested,
    LocationsPageLoaded,
    LocationUpdated,
    LocationsPageToggleLoading,
    LocationDeleted,
    LocationOnServerCreated,
    LocationCreated,
    LocationsActionToggleLoading
} from '../../_actions/Master/location.action'

@Injectable()
export class LocationEffects {
    showPageLoadingDistpatcher = new LocationsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new LocationsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new LocationsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new LocationsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllLocations$ = this.actions$
        .pipe(
            ofType<AllLocationsRequested>(LocationActionTypes.AllLocationsRequested),
            withLatestFrom(this.store.pipe(select(allLocationsLoaded))),
            filter(([action, isAllLocationsLoaded]) => !isAllLocationsLoaded),
            mergeMap(() => this.auth.GetAllLocation()),
            map(Locations => {                             
                return new AllLocationsLoaded({Locations});
            })
          );

    @Effect()
    loadLocationsPage$ = this.actions$
        .pipe(
            ofType<LocationsPageRequested>(LocationActionTypes.LocationsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findLocations called ');
                
                const requestToServer = this.auth.findLocation(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new LocationsPageLoaded({
                    Locations: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteLocation$ = this.actions$
        .pipe(
            ofType<LocationDeleted>(LocationActionTypes.LocationDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteLocation(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateLocation$ = this.actions$
        .pipe(
            ofType<LocationUpdated>(LocationActionTypes.LocationUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateLocation(payload.Location);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createLocation$ = this.actions$
        .pipe(
            ofType<LocationOnServerCreated>(LocationActionTypes.LocationOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createLocation(payload.Location).pipe(
                    tap(res => {
                        this.store.dispatch(new LocationCreated({ Location: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllLocationsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
