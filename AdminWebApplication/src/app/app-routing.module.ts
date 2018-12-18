import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from 'src/services/auth.guard';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';
import { ProductsTableComponent } from './products-table/products-table.component';

const routes: Routes = [
  // { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent},
  { path: "dashboard", component: OrdersDashboardComponent, canActivate: [AuthGuard] },
  { path: "products", component: ProductsTableComponent, canActivate: [AuthGuard] },
  { path: "orders", component: OrdersComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
