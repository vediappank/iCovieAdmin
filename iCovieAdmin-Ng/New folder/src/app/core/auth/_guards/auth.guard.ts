// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// RxJS
import { Observable, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import * as Reducers from '../../../core/auth/_reducers';
import { AuthActions } from '../../../core/auth/_actions';
import { User } from '../_models/MAdministrator/user.model';
import { AuthService } from '../_services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<Reducers.State>, private router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

    

    return this.store
      .pipe(
        select( Reducers.isUserLoggedIn ),
        tap(loggedIn => {
          
          console.log('Auth Guard:: IsLoggedIn:: ' + loggedIn);
          if (!loggedIn) {
          
            this.router.navigate(['/auth/login'], { queryParams: route.queryParams, queryParamsHandling: 'merge' });
          }
        })
      );

  }

   
}
