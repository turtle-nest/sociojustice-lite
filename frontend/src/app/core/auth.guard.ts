import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        /*if (this.auth.isLoggedIn()) {
          return true;
        }*/
        const hasToken = !!this.auth.getToken();
        if (hasToken) return true;
        // Preserve the intended URL so we can redirect after login
        return this.router.createUrlTree(['/auth/login'], {
            queryParams: { redirectUrl: state.url }
        });
    }
}
