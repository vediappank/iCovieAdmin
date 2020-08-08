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
import { allGuestTypesLoaded } from '../../_selectors/Masters/guesttype.selectors';
// Actions
import {
    AllGuestTypesLoaded,
    AllGuestTypesRequested,
    GuestTypeActionTypes,
    GuestTypesPageRequested,
    GuestTypesPageLoaded,
    GuestTypeUpdated,
    GuestTypesPageToggleLoading,
    GuestTypeDeleted,
    GuestTypeOnServerCreated,
    GuestTypeCreated,
    GuestTypesActionToggleLoading
} from '../../_actions/Masters/guesttype.actions'

@Injectable()
export class GuestTypeEffects {
    showPageLoadingDistpatcher = new GuestTypesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new GuestTypesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new GuestTypesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new GuestTypesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllGuestTypes$ = this.actions$
        .pipe(
            ofType<AllGuestTypesRequested>(GuestTypeActionTypes.AllGuestTypesRequested),
            withLatestFrom(this.store.pipe(select(allGuestTypesLoaded))),
            filter(([action, isAllGuestTypesLoaded]) => !isAllGuestTypesLoaded),
            mergeMap(() => this.auth.GetAllGuestType()),
            map(GuestTypes => {                             
                return new AllGuestTypesLoaded({GuestTypes});
            })
          );

    @Effect()
    loadGuestTypesPage$ = this.actions$
        .pipe(
            ofType<GuestTypesPageRequested>(GuestTypeActionTypes.GuestTypesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findGuestTypes called ');
                
                const requestToServer = this.auth.findGuestType(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new GuestTypesPageLoaded({
                    GuestTypes: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteGuestType$ = this.actions$
        .pipe(
            ofType<GuestTypeDeleted>(GuestTypeActionTypes.GuestTypeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteGuestType(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateGuestType$ = this.actions$
        .pipe(
            ofType<GuestTypeUpdated>(GuestTypeActionTypes.GuestTypeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateGuestType(payload.GuestType);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createGuestType$ = this.actions$
        .pipe(
            ofType<GuestTypeOnServerCreated>(GuestTypeActionTypes.GuestTypeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createGuestType(payload.GuestType).pipe(
                    tap(res => {
                        this.store.dispatch(new GuestTypeCreated({ GuestType: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllGuestTypesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
