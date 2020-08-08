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
import { allAminitiesTypesLoaded } from '../../_selectors/Masters/aminitiestype.selectors';
// Actions
import {
    AllAminitiesTypesLoaded,
    AllAminitiesTypesRequested,
    AminitiesTypeActionTypes,
    AminitiesTypesPageRequested,
    AminitiesTypesPageLoaded,
    AminitiesTypeUpdated,
    AminitiesTypesPageToggleLoading,
    AminitiesTypeDeleted,
    AminitiesTypeOnServerCreated,
    AminitiesTypeCreated,
    AminitiesTypesActionToggleLoading
} from '../../_actions/Masters/aminitiestype.actions'

@Injectable()
export class AminitiesTypeEffects {
    showPageLoadingDistpatcher = new AminitiesTypesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new AminitiesTypesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new AminitiesTypesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new AminitiesTypesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllAminitiesTypes$ = this.actions$
        .pipe(
            ofType<AllAminitiesTypesRequested>(AminitiesTypeActionTypes.AllAminitiesTypesRequested),
            withLatestFrom(this.store.pipe(select(allAminitiesTypesLoaded))),
            filter(([action, isAllAminitiesTypesLoaded]) => !isAllAminitiesTypesLoaded),
            mergeMap(() => this.auth.GetAllAminitiesType()),
            map(AminitiesTypes => {                             
                return new AllAminitiesTypesLoaded({AminitiesTypes});
            })
          );

    @Effect()
    loadAminitiesTypesPage$ = this.actions$
        .pipe(
            ofType<AminitiesTypesPageRequested>(AminitiesTypeActionTypes.AminitiesTypesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findAminitiesTypes called ');
                
                const requestToServer = this.auth.findAminitiesType(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new AminitiesTypesPageLoaded({
                    AminitiesTypes: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteAminitiesType$ = this.actions$
        .pipe(
            ofType<AminitiesTypeDeleted>(AminitiesTypeActionTypes.AminitiesTypeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteAminitiesType(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateAminitiesType$ = this.actions$
        .pipe(
            ofType<AminitiesTypeUpdated>(AminitiesTypeActionTypes.AminitiesTypeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateAminitiesType(payload.AminitiesType);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createAminitiesType$ = this.actions$
        .pipe(
            ofType<AminitiesTypeOnServerCreated>(AminitiesTypeActionTypes.AminitiesTypeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createAminitiesType(payload.AminitiesType).pipe(
                    tap(res => {
                        this.store.dispatch(new AminitiesTypeCreated({ AminitiesType: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllAminitiesTypesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
