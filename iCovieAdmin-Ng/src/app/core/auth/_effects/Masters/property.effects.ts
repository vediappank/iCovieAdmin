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
import { allPropertysLoaded } from '../../_selectors/Masters/property.selectors';
// Actions
import {
    AllPropertysLoaded,
    AllPropertysRequested,
    PropertyActionTypes,
    PropertysPageRequested,
    PropertysPageLoaded,
    PropertyUpdated,
    PropertysPageToggleLoading,
    PropertyDeleted,
    PropertyOnServerCreated,
    PropertyCreated,
    PropertysActionToggleLoading
} from '../../_actions/Masters/property.actions'

@Injectable()
export class PropertyEffects {
    showPageLoadingDistpatcher = new PropertysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new PropertysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new PropertysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new PropertysActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllPropertys$ = this.actions$
        .pipe(
            ofType<AllPropertysRequested>(PropertyActionTypes.AllPropertysRequested),
            withLatestFrom(this.store.pipe(select(allPropertysLoaded))),
            filter(([action, isAllPropertysLoaded]) => !isAllPropertysLoaded),
            mergeMap(() => this.auth.GetAllProperty()),
            map(Propertys => {                             
                return new AllPropertysLoaded({Propertys});
            })
          );

    @Effect()
    loadPropertysPage$ = this.actions$
        .pipe(
            ofType<PropertysPageRequested>(PropertyActionTypes.PropertysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findPropertys called ');
                
                const requestToServer = this.auth.findProperty(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new PropertysPageLoaded({
                    Propertys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteProperty$ = this.actions$
        .pipe(
            ofType<PropertyDeleted>(PropertyActionTypes.PropertyDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteProperty(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateProperty$ = this.actions$
        .pipe(
            ofType<PropertyUpdated>(PropertyActionTypes.PropertyUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateProperty(payload.Property);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createProperty$ = this.actions$
        .pipe(
            ofType<PropertyOnServerCreated>(PropertyActionTypes.PropertyOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createProperty(payload.Property).pipe(
                    tap(res => {
                        this.store.dispatch(new PropertyCreated({ Property: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllPropertysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
