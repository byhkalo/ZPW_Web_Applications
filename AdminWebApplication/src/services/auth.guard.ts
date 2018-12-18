import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {

    path: ActivatedRouteSnapshot[];
    readonly route: ActivatedRouteSnapshot;
    // constructor(path: ActivatedRouteSnapshot[])
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log('ROUTER GUARD + ' + next);
        return this.authService.authState().pipe(map(state => {
            if (state != null) {
                console.log('User Logged');
                return true;
            } else {
                console.log('Please Log In');
                this.router.navigate(['/login']);
                return false;
            }
        }));
    }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot): Observable<boolean> {
    
    //       return this.authService.authState()
    //        .map(user => !!user)
    //        .do(loggedIn => {
    //          if (!loggedIn) {
    //            console.log("access denied")
    //            this.router.navigate(['/login']);
    //          }
    //      })
    //    }
}