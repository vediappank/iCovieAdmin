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
import { allBuildingsLoaded } from '../../_selectors/Master/building.selectors';
// Actions
import {
    AllBuildingsLoaded,
    AllBuildingsRequested,
    BuildingActionTypes,
    BuildingsPageRequested,
    BuildingsPageLoaded,
    BuildingUpdated,
    BuildingsPageToggleLoading,
    BuildingDeleted,
    BuildingOnServerCreated,
    BuildingCreated,
    BuildingsActionToggleLoading
} from '../../_actions/Master/Building.actions'

@Injectable()
export class BuildingEffects {
    showPageLoadingDistpatcher = new BuildingsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new BuildingsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new BuildingsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new BuildingsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllBuildings$ = this.actions$
        .pipe(
            ofType<AllBuildingsRequested>(BuildingActionTypes.AllBuildingsRequested),
            withLatestFrom(this.store.pipe(select(allBuildingsLoaded))),
            filter(([action, isAllBuildingsLoaded]) => !isAllBuildingsLoaded),
            mergeMap(() => this.auth.GetALLBuilding()),
            map(Buildings => {                             
                return new AllBuildingsLoaded({Buildings});
            })
          );

    @Effect()
    loadBuildingsPage$ = this.actions$
        .pipe(
            ofType<BuildingsPageRequested>(BuildingActionTypes.BuildingsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findBuildings called ');
                
                const requestToServer = this.auth.findBuilding(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new BuildingsPageLoaded({
                    Buildings: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteBuilding$ = this.actions$
        .pipe(
            ofType<BuildingDeleted>(BuildingActionTypes.BuildingDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteBuilding(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateBuilding$ = this.actions$
        .pipe(
            ofType<BuildingUpdated>(BuildingActionTypes.BuildingUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateBuilding(payload.Building);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createBuilding$ = this.actions$
        .pipe(
            ofType<BuildingOnServerCreated>(BuildingActionTypes.BuildingOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createBuilding(payload.Building).pipe(
                    tap(res => {
                        this.store.dispatch(new BuildingCreated({ Building: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllBuildingsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
