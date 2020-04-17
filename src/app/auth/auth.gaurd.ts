import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree,
  Router} from '@angular/router';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurd implements CanActivate{

  constructor(private authService : AuthService, private router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

      const isAuth = this.authService.getIsAuthenticated();
      if (isAuth) {
        return true;
      }
      this.router.navigate(['/auth/login']);
      return false; // accessible
  }


}
