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
import { allPropertyTypesLoaded } from '../../_selectors/Masters/propertytype.selectors';
// Actions
import {
    AllPropertyTypesLoaded,
    AllPropertyTypesRequested,
    PropertyTypeActionTypes,
    PropertyTypesPageRequested,
    PropertyTypesPageLoaded,
    PropertyTypeUpdated,
    PropertyTypesPageToggleLoading,
    PropertyTypeDeleted,
    PropertyTypeOnServerCreated,
    PropertyTypeCreated,
    PropertyTypesActionToggleLoading
} from '../../_actions/Masters/propertytype.actions'

@Injectable()
export class PropertyTypeEffects {
    showPageLoadingDistpatcher = new PropertyTypesPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new PropertyTypesPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new PropertyTypesActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new PropertyTypesActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllPropertyTypes$ = this.actions$
        .pipe(
            ofType<AllPropertyTypesRequested>(PropertyTypeActionTypes.AllPropertyTypesRequested),
            withLatestFrom(this.store.pipe(select(allPropertyTypesLoaded))),
            filter(([action, isAllPropertyTypesLoaded]) => !isAllPropertyTypesLoaded),
            mergeMap(() => this.auth.GetAllPropertyType()),
            map(PropertyTypes => {                             
                return new AllPropertyTypesLoaded({PropertyTypes});
            })
          );

    @Effect()
    loadPropertyTypesPage$ = this.actions$
        .pipe(
            ofType<PropertyTypesPageRequested>(PropertyTypeActionTypes.PropertyTypesPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findPropertyTypes called ');
                
                const requestToServer = this.auth.findPropertyType(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new PropertyTypesPageLoaded({
                    PropertyTypes: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deletePropertyType$ = this.actions$
        .pipe(
            ofType<PropertyTypeDeleted>(PropertyTypeActionTypes.PropertyTypeDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deletePropertyType(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updatePropertyType$ = this.actions$
        .pipe(
            ofType<PropertyTypeUpdated>(PropertyTypeActionTypes.PropertyTypeUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updatePropertyType(payload.PropertyType);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createPropertyType$ = this.actions$
        .pipe(
            ofType<PropertyTypeOnServerCreated>(PropertyTypeActionTypes.PropertyTypeOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createPropertyType(payload.PropertyType).pipe(
                    tap(res => {
                        this.store.dispatch(new PropertyTypeCreated({ PropertyType: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllPropertyTypesRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
