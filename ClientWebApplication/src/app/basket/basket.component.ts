import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/services/basketService';
import { Product } from 'src/models/product.model';
import { Router } from '@angular/router';
import { ProductsTableDS } from '../products/products-table-datasource';
import { MatDialog } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  totalSum: number = 0;
  totalCount: number = 0;

  displayedColumns = ['name', 'price', 'count', 'amount', 'add', 'remove', 'delete'];
  displayedColumnsFooter = ['name', 'price', 'count', 'amount'];
  dataSource: ProductsTableDS

  constructor(public dialog: MatDialog, private router: Router, private basketService: BasketService) { 
  }

  ngOnInit() {
    this.dataSource = new ProductsTableDS([], null, null);
    this.basketService.getbasketProductsObservable().subscribe(basketProducts => {
      this.dataSource.data = basketProducts
    });
    this.basketService.getProductsSumObservable().subscribe(basketSum => {
      this.totalSum = basketSum;
    });
    this.basketService.getProductsCountObservable().subscribe(basketCount => {
      this.totalCount = basketCount;
    });
  }

  addOneToBasket(product: Product) {
    this.basketService.addOneFromBasket(product);
  }
  removeOneFromBasket(product: Product) {
    this.basketService.removeOneFromBasket(product);
  }
  deleteFromBasket(product: Product) {
    this.basketService.deleteFormBasket(product);
  }

  continueShopping() {
    this.router.navigate(['']);
  }

  makeOrder() {
    if (this.totalCount > 0) {
        const dialogRef = this.dialog.open(OrderFormComponent, 
          { 
            width: '1000px', 
            height: '650px'
          });
        
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
    }
  }
}
