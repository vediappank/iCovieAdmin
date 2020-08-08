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
import { allNeighbourhoodCategorysLoaded } from '../../_selectors/Masters/neighbourhoodcategory.selectors';
// Actions
import {
    AllNeighbourhoodCategorysLoaded,
    AllNeighbourhoodCategorysRequested,
    NeighbourhoodCategoryActionTypes,
    NeighbourhoodCategorysPageRequested,
    NeighbourhoodCategorysPageLoaded,
    NeighbourhoodCategoryUpdated,
    NeighbourhoodCategorysPageToggleLoading,
    NeighbourhoodCategoryDeleted,
    NeighbourhoodCategoryOnServerCreated,
    NeighbourhoodCategoryCreated,
    NeighbourhoodCategorysActionToggleLoading
} from '../../_actions/Masters/neighbourhoodcategory.actions'

@Injectable()
export class NeighbourhoodCategoryEffects {
    showPageLoadingDistpatcher = new NeighbourhoodCategorysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new NeighbourhoodCategorysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new NeighbourhoodCategorysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new NeighbourhoodCategorysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllNeighbourhoodCategorys$ = this.actions$
        .pipe(
            ofType<AllNeighbourhoodCategorysRequested>(NeighbourhoodCategoryActionTypes.AllNeighbourhoodCategorysRequested),
            withLatestFrom(this.store.pipe(select(allNeighbourhoodCategorysLoaded))),
            filter(([action, isAllNeighbourhoodCategorysLoaded]) => !isAllNeighbourhoodCategorysLoaded),
            mergeMap(() => this.auth.GetALLNeighbourhoodCategory()),
            map(NeighbourhoodCategorys => {                             
                return new AllNeighbourhoodCategorysLoaded({NeighbourhoodCategorys});
            })
          );

    @Effect()
    loadNeighbourhoodCategorysPage$ = this.actions$
        .pipe(
            ofType<NeighbourhoodCategorysPageRequested>(NeighbourhoodCategoryActionTypes.NeighbourhoodCategorysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findNeighbourhoodCategorys called ');
                
                const requestToServer = this.auth.findNeighbourhoodCategory(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new NeighbourhoodCategorysPageLoaded({
                    NeighbourhoodCategorys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteNeighbourhoodCategory$ = this.actions$
        .pipe(
            ofType<NeighbourhoodCategoryDeleted>(NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteNeighbourhoodCategory(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateNeighbourhoodCategory$ = this.actions$
        .pipe(
            ofType<NeighbourhoodCategoryUpdated>(NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateNeighbourhoodCategory(payload.NeighbourhoodCategory);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createNeighbourhoodCategory$ = this.actions$
        .pipe(
            ofType<NeighbourhoodCategoryOnServerCreated>(NeighbourhoodCategoryActionTypes.NeighbourhoodCategoryOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createNeighbourhoodCategory(payload.NeighbourhoodCategory).pipe(
                    tap(res => {
                        this.store.dispatch(new NeighbourhoodCategoryCreated({ NeighbourhoodCategory: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllNeighbourhoodCategorysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
