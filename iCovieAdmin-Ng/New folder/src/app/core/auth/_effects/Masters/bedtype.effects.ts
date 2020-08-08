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
import { allBedTypesLoaded } from '../../_selectors/Masters/bedtype.selectors';
// Actions
import {
    AllBedTypesLoaded,
    AllBedTypesRequested,
    BedTypeActionTypes,
    BedTypesPageRequested,
    BedTypesPageLoaded,
    BedTypeUpdated,
    BedTypesPageToggleLoading,
    BedTypeDeleted,
    BedTypeOnServerCreated,
    BedTypeCreated,
    BedTypesActionToggleLoading
} from '../../_actions/Masters/bedtype.actions'

@Injectable()
export class BedTypeEffects {
    showPageLoadingDistpatcher = new BedTypesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new BedTypesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new BedTypesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new BedTypesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllBedTypes$ = this.actions$
        .pipe(
            ofType<AllBedTypesRequested>(BedTypeActionTypes.AllBedTypesRequested),
            withLatestFrom(this.store.pipe(select(allBedTypesLoaded))),
            filter(([action, isAllBedTypesLoaded]) => !isAllBedTypesLoaded),
            mergeMap(() => this.auth.GetAllBedType()),
            map(BedTypes => {                             
                return new AllBedTypesLoaded({BedTypes});
            })
          );

    @Effect()
    loadBedTypesPage$ = this.actions$
        .pipe(
            ofType<BedTypesPageRequested>(BedTypeActionTypes.BedTypesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findBedTypes called ');
                
                const requestToServer = this.auth.findBedType(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new BedTypesPageLoaded({
                    BedTypes: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteBedType$ = this.actions$
        .pipe(
            ofType<BedTypeDeleted>(BedTypeActionTypes.BedTypeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteBedType(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateBedType$ = this.actions$
        .pipe(
            ofType<BedTypeUpdated>(BedTypeActionTypes.BedTypeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateBedType(payload.BedType);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createBedType$ = this.actions$
        .pipe(
            ofType<BedTypeOnServerCreated>(BedTypeActionTypes.BedTypeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createBedType(payload.BedType).pipe(
                    tap(res => {
                        this.store.dispatch(new BedTypeCreated({ BedType: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllBedTypesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
