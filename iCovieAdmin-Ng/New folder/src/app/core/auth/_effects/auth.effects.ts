// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom, switchMap, map } from 'rxjs/operators';
import { defer, Observable, of, combineLatest } from 'rxjs';
// NGRX
import { Actions, Effect, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, login, logout, register, userLoaded, userRequested } from '../_actions/auth.actions';
import { AuthService } from '../_services/index';
import { AppState } from '../../reducers';
import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { AuthActions } from '../_actions';
import { User } from '../_models/MAdministrator/user.model';

@Injectable()
export class AuthEffects implements OnInitEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap((auth) => {
        console.log('Auth Effects:::Login::Called::' + JSON.stringify(auth));
        localStorage.setItem('authTokenKey', auth.authToken);
        // AuthActions.login({authToken: '' + authToken });
        // AuthActions.userRequested();
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        
        console.log('Auth Effects:::logout::Called::');
        // AuthActions.logout();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authTokenKey');
        localStorage.clear();
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.returnUrl } });
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      tap((auth) => {
        console.log('Auth Effects:::register$::Called::' + JSON.stringify(auth));
        localStorage.setItem('authTokenKey', auth.authToken);
      })
    ),
    { dispatch: false }
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userRequested),
      tap((action) => {
        
        console.log('Auth Effects:::loadUser$::Called::' + JSON.stringify(action));
        this.authService.getUserByToken().subscribe(users => {
          if (users) {
            console.log('loadUser$ if loadUser::' + JSON.stringify(action) + '::' + JSON.stringify(users));
            // AuthActions.userLoaded({ user: users[0] });
          } else {
            console.log('loadUser$ else User Not Available::' + action);
            localStorage.clear();
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.returnUrl } });
            // AuthActions.logout();
          }
        });
      })
    ),
    { dispatch: false }
  );

  private returnUrl: string;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Auth Effects::Router Event::' + event.url);
        this.returnUrl = event.url;
      }
    });

    if (localStorage.getItem('currentUser')) {
      const userToken = JSON.parse(localStorage.getItem('currentUser')).token;
      if (userToken) {
        of(AuthActions.login({ authToken: userToken }));
      }
    }
  }

  ngrxOnInitEffects(): Action {   
    console.log('Auth Effects::ngrxOnInitEffects:::');
    const observableResult = { type: 'NO_ACTION' };

    if (localStorage.getItem('currentUser')) {
      let userLoggedIn: User;
      // userLoggedIn = Object.setPrototypeOf(localStorage.getItem('userLoggedIn'), User.prototype);
      if (localStorage.getItem('userLoggedIn') != "undefined" ) {
        userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn')) as User;
        //console.log('Auth Effects::ngrxOnInitEffects::localStorage :currentUser::: ' + JSON.stringify(userLoggedIn) );
        if (userLoggedIn) {
          this.store.dispatch(AuthActions.login({ authToken: JSON.parse(localStorage.getItem('currentUser')).token }));
          this.store.dispatch(AuthActions.userLoaded({ user: userLoggedIn }));
        }
      }
    }

    return observableResult;

  }

  /*@Effect({dispatch: false})
  login$ = this.actions$.pipe(
      ofType<Login>(AuthActionTypes.Login),
      tap(action => {           
         if (localStorage.hasOwnProperty('authTokenKey'))
          localStorage.setItem('authTokenKey', JSON.parse(localStorage.getItem('currentUser')).token);
      
          this.store.dispatch(new UserRequested());
      }),
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
      ofType<Logout>(AuthActionTypes.Logout),
      tap(() => {           
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authTokenKey');
          localStorage.clear();
    this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
      })
  );

  @Effect({dispatch: false})
  register$ = this.actions$.pipe(
      ofType<Register>(AuthActionTypes.Register),
      tap(action => {           
          localStorage.setItem('authTokenKey', JSON.parse(localStorage.getItem('currentUser')).token);
      })
  );

  @Effect({dispatch: false})
  loadUser$ = this.actions$
  .pipe(
      ofType<UserRequested>(AuthActionTypes.UserRequested),
      withLatestFrom(this.store.pipe(select(isUserLoaded))),
      filter(([action, isUserLoaded]) => !isUserLoaded),
      mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
      tap(_user => {              
         // alert('effect loadUser');  
          if (_user) {
              //alert('if loadUser');
              this.store.dispatch(new UserLoaded({ user: _user }));
          } else {
             // alert('else loadUser');
              this.store.dispatch(new Logout());
          }
      })
    );

  @Effect()
  init$: Observable<Action> = defer(() => {
      const userToken =JSON.parse(localStorage.getItem('currentUser')).token;
      let observableResult = of({type: 'NO_ACTION'});
      if (userToken) {
          observableResult = of(new Login({  authToken: userToken }));
      }
      return observableResult;
  });

  private returnUrl: string;

  constructor(private actions$: Actions,
      private router: Router,
      private auth: AuthService,
      private store: Store<AppState>) {

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
             // alert('auth Effeect');
      this.returnUrl = event.url;
    }
  });
}*/
}
