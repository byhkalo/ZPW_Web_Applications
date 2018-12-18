import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsTableDS } from '../products-table/products-table-datasource';
import { OrdersTableDS } from './orders-table-datasource';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Order } from 'src/models/order.model';
import { OrderComponent } from '../order/order.component';
import { OrdersService } from 'src/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginatorUnmanaged: MatPaginator;
  @ViewChild(MatPaginator) paginatorInProcess: MatPaginator;
  @ViewChild(MatPaginator) paginatorCompleted: MatPaginator;
  @ViewChild(MatSort) sortUnmanaged: MatSort;
  @ViewChild(MatSort) sortInProcess: MatSort;
  @ViewChild(MatSort) sortCompleted: MatSort;

  unmanagedOrdersDataSource: OrdersTableDS;
  inProcessOrdersDataSource: OrdersTableDS;
  completedOrdersDataSource: OrdersTableDS;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'clientLastName', 'telephone', 'price'];

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: Order;

  constructor(public dialog: MatDialog, private ordersService: OrdersService) { }

  ngOnInit() {
    this.unmanagedOrdersDataSource = new OrdersTableDS([], this.paginatorUnmanaged, this.sortUnmanaged);
    this.inProcessOrdersDataSource = new OrdersTableDS([], this.paginatorInProcess, this.sortInProcess);
    this.completedOrdersDataSource = new OrdersTableDS([], this.paginatorCompleted, this.sortCompleted);
    this.ordersService.getUnmanagedOrders().subscribe(unmanagedOrders => {
      this.unmanagedOrdersDataSource.data = unmanagedOrders;
    });
    this.ordersService.getInProcessOrders().subscribe(inProcessOrders => {
      this.inProcessOrdersDataSource.data = inProcessOrders;
    });
    this.ordersService.getCompletedOrders().subscribe(completedOrders => {
      this.completedOrdersDataSource.data = completedOrders;
    });
  }

  applyFilterUnmanaged(filterValue: string) {
    this.unmanagedOrdersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterInProcess(filterValue: string) {
    this.inProcessOrdersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterCompleted(filterValue: string) {
    this.completedOrdersDataSource.filter = filterValue.trim().toLowerCase();
  }
  
  unmanagedSelectRow(row: Order) {
    console.log(row);
    const dialogRef = this.dialog.open(OrderComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  inProcessSelectRow(row: Order) {
    console.log(row);
    const dialogRef = this.dialog.open(OrderComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  completedSelectRow(row: Order) {
    console.log(row);
    const dialogRef = this.dialog.open(OrderComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  //https://stackblitz.com/edit/angular-material-expandable-table-rows?file=app%2Ftable%2Ftable.component.scss
  //https://stackblitz.com/edit/angular-5bddkx?file=app%2Ftable-basic-example.html
  //https://stackblitz.com/angular/aqeybgobndl?file=app%2Fcdk-drag-drop-enter-predicate-example.ts
}
