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
import { allAminitiessLoaded } from '../../_selectors/Masters/aminities.selectors';
// Actions
import {
    AllAminitiessLoaded,
    AllAminitiessRequested,
    AminitiesActionTypes,
    AminitiessPageRequested,
    AminitiessPageLoaded,
    AminitiesUpdated,
    AminitiessPageToggleLoading,
    AminitiesDeleted,
    AminitiesOnServerCreated,
    AminitiesCreated,
    AminitiessActionToggleLoading
} from '../../_actions/Masters/aminities.actions'

@Injectable()
export class AminitiesEffects {
    showPageLoadingDistpatcher = new AminitiessPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new AminitiessPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new AminitiessActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new AminitiessActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllAminitiess$ = this.actions$
        .pipe(
            ofType<AllAminitiessRequested>(AminitiesActionTypes.AllAminitiessRequested),
            withLatestFrom(this.store.pipe(select(allAminitiessLoaded))),
            filter(([action, isAllAminitiessLoaded]) => !isAllAminitiessLoaded),
            mergeMap(() => this.auth.GetAllAminities()),
            map(Aminitiess => {                             
                return new AllAminitiessLoaded({Aminitiess});
            })
          );

    @Effect()
    loadAminitiessPage$ = this.actions$
        .pipe(
            ofType<AminitiessPageRequested>(AminitiesActionTypes.AminitiessPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findAminitiess called ');
                
                const requestToServer = this.auth.findAminities(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new AminitiessPageLoaded({
                    Aminitiess: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteAminities$ = this.actions$
        .pipe(
            ofType<AminitiesDeleted>(AminitiesActionTypes.AminitiesDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteAminities(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateAminities$ = this.actions$
        .pipe(
            ofType<AminitiesUpdated>(AminitiesActionTypes.AminitiesUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateAminities(payload.Aminities);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createAminities$ = this.actions$
        .pipe(
            ofType<AminitiesOnServerCreated>(AminitiesActionTypes.AminitiesOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createAminities(payload.Aminities).pipe(
                    tap(res => {
                        this.store.dispatch(new AminitiesCreated({ Aminities: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllAminitiessRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
