import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Order } from 'src/models/order.model';
import { ProductsTableDS } from '../products-table/products-table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from 'src/models/product.model';
import { OrdersService } from 'src/services/orders.service';

@Component({
  host: {'class':'col-xl-12'},
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order: Order
  orderCategory: string;
  orderCategories: string[] = ['Unmanaged', 'In Process', 'Completed'];
  dataSource: ProductsTableDS;
  selection: SelectionModel<Product>;
  displayedColumns = ['id', 'name', 'price', 'count', 'select'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Order | null, private ordersService: OrdersService) { 
    this.order = this.data;
    console.log('Categoty = ' + this.data.category)
    this.orderCategory = this.data.category;
    console.log('Products = ' + this.data.products);
    this.dataSource = new ProductsTableDS(this.data.products, null, null);
    console.log('Datasource = ' + this.dataSource);
    console.log('Datasource.Data = ' + this.dataSource.data);
    let selectedProducts = this.data.products.filter((product, index, array) => {
      return this.data.completness[index];
    })
    this.selection = new SelectionModel<Product>(true, selectedProducts);
  }

  ngOnInit() {
  }
  optionChanged(event) {
    this.orderCategory = event.value
    console.log('new Value', event.value);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  updateOrder() {
    console.log('CATEGORY = ' + this.order.category)
    switch (this.order.category) {
      case 'Unmanaged': 
        this.ordersService.updateUnmanagedOrder(this.order, this.selection.selected, this.orderCategory); break;
      case 'In Process': this.ordersService.updateInProcessOrder(this.order, this.selection.selected, this.orderCategory); break;
      case 'Completed': this.ordersService.updateCompletedOrder(this.order, this.selection.selected, this.orderCategory); break;
    }
  }
}
