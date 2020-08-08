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
import { allSignupsLoaded } from '../../_selectors/Masters/signup.selectors';
// Actions
import {
    AllSignupsLoaded,
    AllSignupsRequested,
    SignupActionTypes,
    SignupsPageRequested,
    SignupsPageLoaded,
    SignupUpdated,
    SignupsPageToggleLoading,
    SignupDeleted,
    SignupOnServerCreated,
    SignupCreated,
    SignupsActionToggleLoading
} from '../../_actions/Masters/signup.actions'

@Injectable()
export class SignupEffects {
    showPageLoadingDistpatcher = new SignupsPageToggleLoading({ isLoading: true });
    hidePageLoadingDistpatcher = new SignupsPageToggleLoading({ isLoading: false });

    showActionLoadingDistpatcher = new SignupsActionToggleLoading({ isLoading: true });
    hideActionLoadingDistpatcher = new SignupsActionToggleLoading({ isLoading: false });

    @Effect()
    loadAllSignups$ = this.actions$
        .pipe(
            ofType<AllSignupsRequested>(SignupActionTypes.AllSignupsRequested),
            withLatestFrom(this.store.pipe(select(allSignupsLoaded))),
            filter(([action, isAllSignupsLoaded]) => !isAllSignupsLoaded),
            mergeMap(() => this.auth.GetAllSignup()),
            map(Signups => {                             
                return new AllSignupsLoaded({Signups});
            })
          );

    @Effect()
    loadSignupsPage$ = this.actions$
        .pipe(
            ofType<SignupsPageRequested>(SignupActionTypes.SignupsPageRequested),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showPageLoadingDistpatcher);
               // alert('findSignups called ');
                
                const requestToServer = this.auth.findSignup(payload.page);
                const lastQuery = of(payload.page);
                return forkJoin(requestToServer, lastQuery);
            }),
            map(response => {
                
                const result: QueryResultsModel = response[0];
                const lastQuery: QueryParamsModel = response[1];
                this.store.dispatch(this.hidePageLoadingDistpatcher);

                return new SignupsPageLoaded({
                    Signups: result.items,
                    totalCount: result.totalCount,
                    page: lastQuery
                });
            }),
        );

    @Effect()
    deleteSignup$ = this.actions$
        .pipe(
            ofType<SignupDeleted>(SignupActionTypes.SignupDeleted),
            mergeMap(( { payload } ) => {
                    this.store.dispatch(this.showActionLoadingDistpatcher);
                    return this.auth.deleteSignup(payload.id);
                }
            ),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    updateSignup$ = this.actions$
        .pipe(
            ofType<SignupUpdated>(SignupActionTypes.SignupUpdated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.updateSignup(payload.Signup);
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );


    @Effect()
    createSignup$ = this.actions$
        .pipe(
            ofType<SignupOnServerCreated>(SignupActionTypes.SignupOnServerCreated),
            mergeMap(( { payload } ) => {
                this.store.dispatch(this.showActionLoadingDistpatcher);
                return this.auth.createSignup(payload.Signup).pipe(
                    tap(res => {
                        this.store.dispatch(new SignupCreated({ Signup: res }));
                    })
                );
            }),
            map(() => {
                return this.hideActionLoadingDistpatcher;
            }),
        );

    @Effect()
    init$: Observable<Action> = defer(() => {
        // return of(new AllSignupsRequested());
        const observableResult = of({ type: 'NO_ACTION' });
        return observableResult;
    });

    constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
