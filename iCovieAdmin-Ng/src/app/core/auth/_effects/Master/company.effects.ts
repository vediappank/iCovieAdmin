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
import { allCompanysLoaded } from '../../_selectors/Master/Company.selectors';
// Actions
import {
    AllCompanysLoaded,
    AllCompanysRequested,
    CompanyActionTypes,
    CompanysPageRequested,
    CompanysPageLoaded,
    CompanyUpdated,
    CompanysPageToggleLoading,
    CompanyDeleted,
    CompanyOnServerCreated,
    CompanyCreated,
    CompanysActionToggleLoading
} from '../../_actions/Master/company.actions'

@Injectable()
export class CompanyEffects {
    showPageLoadingDistpatcher = new CompanysPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new CompanysPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new CompanysActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new CompanysActionToggleLoading({ isLoading: false });
   
    @Effect()
    loadAllCompanys$ = this.actions$
        .pipe(
            ofType<AllCompanysRequested>(CompanyActionTypes.AllCompanysRequested),
            withLatestFrom(this.store.pipe(select(allCompanysLoaded))),
            filter(([action, isAllCompanysLoaded]) => !isAllCompanysLoaded),
            mergeMap(() => this.auth.GetALLCompany()),
            map(Companys => {                             
                return new AllCompanysLoaded({Companys});
            })
          );

    @Effect()
    loadCompanysPage$ = this.actions$
        .pipe(
            ofType<CompanysPageRequested>(CompanyActionTypes.CompanysPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findCompanys called ');
                
                const requestToServer = this.auth.findCompany(payload.page);
                
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new CompanysPageLoaded({
                    Companys: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteCompany$ = this.actions$
        .pipe(
            ofType<CompanyDeleted>(CompanyActionTypes.CompanyDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteCompany(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateCompany$ = this.actions$
        .pipe(
            ofType<CompanyUpdated>(CompanyActionTypes.CompanyUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateCompany(payload.Company);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createCompany$ = this.actions$
        .pipe(
            ofType<CompanyOnServerCreated>(CompanyActionTypes.CompanyOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createCompany(payload.Company).pipe(
                    tap(res => {
                        this.store.dispatch(new CompanyCreated({ Company: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllCompanysRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
