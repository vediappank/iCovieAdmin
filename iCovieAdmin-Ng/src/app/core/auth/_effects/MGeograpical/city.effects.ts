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
import { allCitysLoaded } from '../../_selectors/MGeograpical/City.selectors';
// Actions
import {
    AllCitysLoaded,
    AllCitysRequested,
    CityActionTypes,
    CitysPageRequested,
    CitysPageLoaded,
    CityUpdated,
    CitysPageToggleLoading,
    CityDeleted,
    CityOnServerCreated,
    CityCreated,
    CitysActionToggleLoading
} from '../../_actions/MGeograpical/city.actions';

@Injectable()
export class CityEffects {
    showPageLoadingDistpatcher = new CitysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CitysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CitysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CitysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllCitys$ = this.actions$
        .pipe(
            ofType<AllCitysRequested>(CityActionTypes.AllCitysRequested),
            withLatestFrom(this.store.pipe(select(allCitysLoaded))),
            filter(([action, isAllCitysLoaded]) => !isAllCitysLoaded),
            mergeMap(() => this.auth.GetALLCity()),
            map(Citys => {                             
                return new AllCitysLoaded({Citys});
            })
          );

    @Effect()
    loadCitysPage$ = this.actions$
        .pipe(
            ofType<CitysPageRequested>(CityActionTypes.CitysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findCitys called ');
                
                const requestToServer = this.auth.findCity(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CitysPageLoaded({
                    Citys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCity$ = this.actions$
        .pipe(
            ofType<CityDeleted>(CityActionTypes.CityDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCity(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCity$ = this.actions$
        .pipe(
            ofType<CityUpdated>(CityActionTypes.CityUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCity(payload.City);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCity$ = this.actions$
        .pipe(
            ofType<CityOnServerCreated>(CityActionTypes.CityOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCity(payload.City).pipe(
                    tap(res => {
                        this.store.dispatch(new CityCreated({ City: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCitysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
