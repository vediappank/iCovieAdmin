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
import { allWingTypesLoaded } from '../../_selectors/Masters/wingtype.selectors';
// Actions
import {
    AllWingTypesLoaded,
    AllWingTypesRequested,
    WingTypeActionTypes,
    WingTypesPageRequested,
    WingTypesPageLoaded,
    WingTypeUpdated,
    WingTypesPageToggleLoading,
    WingTypeDeleted,
    WingTypeOnServerCreated,
    WingTypeCreated,
    WingTypesActionToggleLoading
} from '../../_actions/Masters/wingtype.actions'

@Injectable()
export class WingTypeEffects {
    showPageLoadingDistpatcher = new WingTypesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new WingTypesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new WingTypesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new WingTypesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllWingTypes$ = this.actions$
        .pipe(
            ofType<AllWingTypesRequested>(WingTypeActionTypes.AllWingTypesRequested),
            withLatestFrom(this.store.pipe(select(allWingTypesLoaded))),
            filter(([action, isAllWingTypesLoaded]) => !isAllWingTypesLoaded),
            mergeMap(() => this.auth.GetAllWingType()),
            map(WingTypes => {                             
                return new AllWingTypesLoaded({WingTypes});
            })
          );

    @Effect()
    loadWingTypesPage$ = this.actions$
        .pipe(
            ofType<WingTypesPageRequested>(WingTypeActionTypes.WingTypesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findWingTypes called ');
                
                const requestToServer = this.auth.findWingType(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new WingTypesPageLoaded({
                    WingTypes: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteWingType$ = this.actions$
        .pipe(
            ofType<WingTypeDeleted>(WingTypeActionTypes.WingTypeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteWingType(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateWingType$ = this.actions$
        .pipe(
            ofType<WingTypeUpdated>(WingTypeActionTypes.WingTypeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateWingType(payload.WingType);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createWingType$ = this.actions$
        .pipe(
            ofType<WingTypeOnServerCreated>(WingTypeActionTypes.WingTypeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createWingType(payload.WingType).pipe(
                    tap(res => {
                        this.store.dispatch(new WingTypeCreated({ WingType: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllWingTypesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
