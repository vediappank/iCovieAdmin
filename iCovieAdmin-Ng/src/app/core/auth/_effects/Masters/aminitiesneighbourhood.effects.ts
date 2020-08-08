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
import { allAminitiesNeighbourhoodsLoaded } from '../../_selectors/Masters/aminitiesneighbourhood.selectors';
// Actions
import {
    AllAminitiesNeighbourhoodsLoaded,
    AllAminitiesNeighbourhoodsRequested,
    AminitiesNeighbourhoodActionTypes,
    AminitiesNeighbourhoodsPageRequested,
    AminitiesNeighbourhoodsPageLoaded,
    AminitiesNeighbourhoodUpdated,
    AminitiesNeighbourhoodsPageToggleLoading,
    AminitiesNeighbourhoodDeleted,
    AminitiesNeighbourhoodOnServerCreated,
    AminitiesNeighbourhoodCreated,
    AminitiesNeighbourhoodsActionToggleLoading
} from '../../_actions/Masters/aminitiesneighbourhood.actions'

@Injectable()
export class AminitiesNeighbourhoodEffects {
    showPageLoadingDistpatcher = new AminitiesNeighbourhoodsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new AminitiesNeighbourhoodsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new AminitiesNeighbourhoodsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new AminitiesNeighbourhoodsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllAminitiesNeighbourhoods$ = this.actions$
        .pipe(
            ofType<AllAminitiesNeighbourhoodsRequested>(AminitiesNeighbourhoodActionTypes.AllAminitiesNeighbourhoodsRequested),
            withLatestFrom(this.store.pipe(select(allAminitiesNeighbourhoodsLoaded))),
            filter(([action, isAllAminitiesNeighbourhoodsLoaded]) => !isAllAminitiesNeighbourhoodsLoaded),
            mergeMap(() => this.auth.GetAllAminitiesNeighbourhood()),
            map(AminitiesNeighbourhoods => {                             
                return new AllAminitiesNeighbourhoodsLoaded({AminitiesNeighbourhoods});
            })
          );

    @Effect()
    loadAminitiesNeighbourhoodsPage$ = this.actions$
        .pipe(
            ofType<AminitiesNeighbourhoodsPageRequested>(AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findAminitiesNeighbourhoods called ');
                
                const requestToServer = this.auth.findAminitiesNeighbourhood(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new AminitiesNeighbourhoodsPageLoaded({
                    AminitiesNeighbourhoods: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteAminitiesNeighbourhood$ = this.actions$
        .pipe(
            ofType<AminitiesNeighbourhoodDeleted>(AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteAminitiesNeighbourhood(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateAminitiesNeighbourhood$ = this.actions$
        .pipe(
            ofType<AminitiesNeighbourhoodUpdated>(AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateAminitiesNeighbourhood(payload.AminitiesNeighbourhood);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createAminitiesNeighbourhood$ = this.actions$
        .pipe(
            ofType<AminitiesNeighbourhoodOnServerCreated>(AminitiesNeighbourhoodActionTypes.AminitiesNeighbourhoodOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createAminitiesNeighbourhood(payload.AminitiesNeighbourhood).pipe(
                    tap(res => {
                        this.store.dispatch(new AminitiesNeighbourhoodCreated({ AminitiesNeighbourhood: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllAminitiesNeighbourhoodsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
