import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ServerSettingService } from 'src/services/server.setting.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css'],
})
export class OrdersDashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */

  isFirebaseServer: boolean | null = null;

  constructor(private breakpointObserver: BreakpointObserver, private serverSettingService: ServerSettingService) {
    serverSettingService.getServerTypeFirebaseObservable().subscribe(isFirebaseServer => {
      this.isFirebaseServer = isFirebaseServer;
    });
  }

  onToggle() {
    console.log('toggle change = ' + this.isFirebaseServer);
    if (this.serverSettingService.isFirebaseServer() != this.isFirebaseServer) {
      this.serverSettingService.setServerType(this.isFirebaseServer);
    }

  }
}
