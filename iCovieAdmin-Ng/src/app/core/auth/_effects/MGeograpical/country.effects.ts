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
import { allCountrysLoaded } from '../../_selectors/MGeograpical/country.selectors';
// Actions
import {
    AllCountrysLoaded,
    AllCountrysRequested,
    CountryActionTypes,
    CountrysPageRequested,
    CountrysPageLoaded,
    CountryUpdated,
    CountrysPageToggleLoading,
    CountryDeleted,
    CountryOnServerCreated,
    CountryCreated,
    CountrysActionToggleLoading
} from '../../_actions/MGeograpical/country.actions';

@Injectable()
export class CountryEffects {
    showPageLoadingDistpatcher = new CountrysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CountrysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CountrysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CountrysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllCountrys$ = this.actions$
        .pipe(
            ofType<AllCountrysRequested>(CountryActionTypes.AllCountrysRequested),
            withLatestFrom(this.store.pipe(select(allCountrysLoaded))),
            filter(([action, isAllCountrysLoaded]) => !isAllCountrysLoaded),
            mergeMap(() => this.auth.GetALLCountry()),
            map(Countrys => {    
                alert('allCountrys called ');                         
                return new AllCountrysLoaded({Countrys});
            })
          );

    @Effect()
    loadCountrysPage$ = this.actions$
        .pipe(
            ofType<CountrysPageRequested>(CountryActionTypes.CountrysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findCountrys called ');
                
                const requestToServer = this.auth.findCountry(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CountrysPageLoaded({
                    Countrys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCountry$ = this.actions$
        .pipe(
            ofType<CountryDeleted>(CountryActionTypes.CountryDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCountry(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCountry$ = this.actions$
        .pipe(
            ofType<CountryUpdated>(CountryActionTypes.CountryUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCountry(payload.Country);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCountry$ = this.actions$
        .pipe(
            ofType<CountryOnServerCreated>(CountryActionTypes.CountryOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCountry(payload.Country).pipe(
                    tap(res => {
                        this.store.dispatch(new CountryCreated({ Country: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCountrysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
