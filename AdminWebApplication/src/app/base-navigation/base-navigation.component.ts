import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-navigation',
  templateUrl: './base-navigation.component.html',
  styleUrls: ['./base-navigation.component.css'],
})
export class BaseNavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

  openDashboard() {
    this.router.navigate(['/dashboard']);
  }
  openProducts() {
    this.router.navigate(['/products']);
  }
  openOrders() {
    this.router.navigate(['/orders']);
  }
}
