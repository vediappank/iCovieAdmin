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
import { allBusinessCategorysLoaded } from '../../_selectors/Masters/businesscategory.selectors';
// Actions
import {
    AllBusinessCategorysLoaded,
    AllBusinessCategorysRequested,
    BusinessCategoryActionTypes,
    BusinessCategorysPageRequested,
    BusinessCategorysPageLoaded,
    BusinessCategoryUpdated,
    BusinessCategorysPageToggleLoading,
    BusinessCategoryDeleted,
    BusinessCategoryOnServerCreated,
    BusinessCategoryCreated,
    BusinessCategorysActionToggleLoading
} from '../../_actions/Masters/businesscategory.actions'

@Injectable()
export class BusinessCategoryEffects {
    showPageLoadingDistpatcher = new BusinessCategorysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new BusinessCategorysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new BusinessCategorysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new BusinessCategorysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllBusinessCategorys$ = this.actions$
        .pipe(
            ofType<AllBusinessCategorysRequested>(BusinessCategoryActionTypes.AllBusinessCategorysRequested),
            withLatestFrom(this.store.pipe(select(allBusinessCategorysLoaded))),
            filter(([action, isAllBusinessCategorysLoaded]) => !isAllBusinessCategorysLoaded),
            mergeMap(() => this.auth.GetAllBusinessCategory()),
            map(BusinessCategorys => {                             
                return new AllBusinessCategorysLoaded({BusinessCategorys});
            })
          );

    @Effect()
    loadBusinessCategorysPage$ = this.actions$
        .pipe(
            ofType<BusinessCategorysPageRequested>(BusinessCategoryActionTypes.BusinessCategorysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findBusinessCategorys called ');
                
                const requestToServer = this.auth.findBusinessCategory(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new BusinessCategorysPageLoaded({
                    BusinessCategorys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteBusinessCategory$ = this.actions$
        .pipe(
            ofType<BusinessCategoryDeleted>(BusinessCategoryActionTypes.BusinessCategoryDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteBusinessCategory(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateBusinessCategory$ = this.actions$
        .pipe(
            ofType<BusinessCategoryUpdated>(BusinessCategoryActionTypes.BusinessCategoryUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateBusinessCategory(payload.BusinessCategory);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createBusinessCategory$ = this.actions$
        .pipe(
            ofType<BusinessCategoryOnServerCreated>(BusinessCategoryActionTypes.BusinessCategoryOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createBusinessCategory(payload.BusinessCategory).pipe(
                    tap(res => {
                        this.store.dispatch(new BusinessCategoryCreated({ BusinessCategory: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllBusinessCategorysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
