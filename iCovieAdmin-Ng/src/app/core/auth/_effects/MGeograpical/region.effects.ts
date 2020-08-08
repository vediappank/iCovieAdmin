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
import { allRegionsLoaded } from '../../_selectors/MGeograpical/Region.selectors';
// Actions
import {
    AllRegionsLoaded,
    AllRegionsRequested,
    RegionActionTypes,
    RegionsPageRequested,
    RegionsPageLoaded,
    RegionUpdated,
    RegionsPageToggleLoading,
    RegionDeleted,
    RegionOnServerCreated,
    RegionCreated,
    RegionsActionToggleLoading
} from '../../_actions/MGeograpical/Region.actions'

@Injectable()
export class RegionEffects {
    showPageLoadingDistpatcher = new RegionsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new RegionsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new RegionsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new RegionsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllRegions$ = this.actions$
        .pipe(
            ofType<AllRegionsRequested>(RegionActionTypes.AllRegionsRequested),
            withLatestFrom(this.store.pipe(select(allRegionsLoaded))),
            filter(([action, isAllRegionsLoaded]) => !isAllRegionsLoaded),
            mergeMap(() => this.auth.GetALLRegion()),
            map(Regions => {                             
                return new AllRegionsLoaded({Regions});
            })
          );

    @Effect()
    loadRegionsPage$ = this.actions$
        .pipe(
            ofType<RegionsPageRequested>(RegionActionTypes.RegionsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findRegions called ');
                
                const requestToServer = this.auth.findRegion(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new RegionsPageLoaded({
                    Regions: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteRegion$ = this.actions$
        .pipe(
            ofType<RegionDeleted>(RegionActionTypes.RegionDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteRegion(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateRegion$ = this.actions$
        .pipe(
            ofType<RegionUpdated>(RegionActionTypes.RegionUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateRegion(payload.Region);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createRegion$ = this.actions$
        .pipe(
            ofType<RegionOnServerCreated>(RegionActionTypes.RegionOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createRegion(payload.Region).pipe(
                    tap(res => {
                        this.store.dispatch(new RegionCreated({ Region: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllRegionsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
