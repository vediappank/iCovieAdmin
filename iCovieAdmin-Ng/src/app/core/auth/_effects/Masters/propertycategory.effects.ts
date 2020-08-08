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
import { allPropertyCategorysLoaded } from '../../_selectors/Masters/propertycategory.selectors';
// Actions
import {
    AllPropertyCategorysLoaded,
    AllPropertyCategorysRequested,
    PropertyCategoryActionTypes,
    PropertyCategorysPageRequested,
    PropertyCategorysPageLoaded,
    PropertyCategoryUpdated,
    PropertyCategorysPageToggleLoading,
    PropertyCategoryDeleted,
    PropertyCategoryOnServerCreated,
    PropertyCategoryCreated,
    PropertyCategorysActionToggleLoading
} from '../../_actions/Masters/propertycategory.actions'

@Injectable()
export class PropertyCategoryEffects {
    showPageLoadingDistpatcher = new PropertyCategorysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new PropertyCategorysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new PropertyCategorysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new PropertyCategorysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllPropertyCategorys$ = this.actions$
        .pipe(
            ofType<AllPropertyCategorysRequested>(PropertyCategoryActionTypes.AllPropertyCategorysRequested),
            withLatestFrom(this.store.pipe(select(allPropertyCategorysLoaded))),
            filter(([action, isAllPropertyCategorysLoaded]) => !isAllPropertyCategorysLoaded),
            mergeMap(() => this.auth.GetAllPropertyCategory()),
            map(PropertyCategorys => {                             
                return new AllPropertyCategorysLoaded({PropertyCategorys});
            })
          );

    @Effect()
    loadPropertyCategorysPage$ = this.actions$
        .pipe(
            ofType<PropertyCategorysPageRequested>(PropertyCategoryActionTypes.PropertyCategorysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findPropertyCategorys called ');
                
                const requestToServer = this.auth.findPropertyCategory(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new PropertyCategorysPageLoaded({
                    PropertyCategorys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deletePropertyCategory$ = this.actions$
        .pipe(
            ofType<PropertyCategoryDeleted>(PropertyCategoryActionTypes.PropertyCategoryDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deletePropertyCategory(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updatePropertyCategory$ = this.actions$
        .pipe(
            ofType<PropertyCategoryUpdated>(PropertyCategoryActionTypes.PropertyCategoryUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updatePropertyCategory(payload.PropertyCategory);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createPropertyCategory$ = this.actions$
        .pipe(
            ofType<PropertyCategoryOnServerCreated>(PropertyCategoryActionTypes.PropertyCategoryOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createPropertyCategory(payload.PropertyCategory).pipe(
                    tap(res => {
                        this.store.dispatch(new PropertyCategoryCreated({ PropertyCategory: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllPropertyCategorysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
