import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogRef } from '@angular/material';
import { ProductsTableDS } from './products-table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import {MAT_DIALOG_DATA} from '@angular/material';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ProductComponent } from '../product/product.component';
import { Product } from 'src/models/product.model';
import { ProductsService } from 'src/services/products.service';
import { PromotionsService } from 'src/services/promotions.service';


@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})

export class ProductsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dataSource: ProductsTableDataSource;
  dataSource: ProductsTableDS;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'image', 'name', 'category', 'price', 'count', 'select'];
  // Promotion
  selection = new SelectionModel<Product>(true, []);
  promotionValue: number = 0;
  promotionDuration: number = 0;
constructor(public dialog: MatDialog, private productsService: ProductsService) {}
  ngOnInit() {
    // this.dataSource = new ProductsTableDataSource(this.paginator, this.sort);
    this.dataSource = new ProductsTableDS([], this.paginator, this.sort);
    this.productsService.getProducts().subscribe(allProducts => {
      this.dataSource.data = allProducts;
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  createNewProduct() {
    this.selectRow(null)
  }
  selectRow(row: Product) {
    const dialogRef = this.dialog.open(ProductComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
  openPromotionDialog() {
    const dialogRef = this.dialog.open(PromotionDialog, {width: '700px', height: '600px',
        data: {
          selections: this.selection.selected, 
          value: this.promotionValue, 
          duration: this.promotionValue
        }
      });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.selection.clear()
      }
      console.log(`Dialog result: ${result}`);
    });
  }
}


/// ------------------------------------------------
/// ------------------------------------------------
/// ------------------------------------------------


@Component({
  selector: 'promotion-dialog',
  templateUrl: 'promotion-dialog.html',
  styleUrls: ['promotion-dialog-style.css'],
})
export class PromotionDialog {

  displayedColumns = ['id', 'name', 'price', 'count'];
  dataSource: ProductsTableDS
  @ViewChild(MatPaginator) paginator: MatPaginator;

  value = 0;

  dateValue: Date;
  timeValue: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PromotionDialog>,
  private promotionsService: PromotionsService) {
    console.log(data.selections);
    this.dataSource = new ProductsTableDS(data.selections, this.paginator, null);
    let dateNow= new Date();
    this.dateValue = dateNow;
    this.timeValue = dateNow;
    // this.timeValue = 
  }

  formatLabel(value: number | null) {
    return value ? value + '%' : 0 + '%';
  }
  
  minutesChanged(value: string) {
    let minutesNumber = Number(value).valueOf()
    console.log('minutes = ' + minutesNumber)
    var currentDate = Math.floor(Date.now() /1000);
    console.log('currentDate = ' + currentDate)
    currentDate = currentDate + (minutesNumber*60)
    console.log('currentDate + minutes = ' + currentDate)
    let futureDate = new Date(currentDate*1000);
    this.dateValue = futureDate;
    this.timeValue = futureDate;
  }

  makePromotion() {
    console.log('dataValue = ' + this.dateValue);
    console.log('timeValue = ' + this.timeValue);
    var promotionFinalDate = this.dateValue
    let timestamp: any = this.timeValue.valueOf()
     
    var hours: number;
    var minutes: number;
    console.log('timestamp = ' + timestamp);
    console.log('Type = ' + typeof(timestamp));
    if (typeof(timestamp) == 'string') {
      console.log('timestamp is NaN');
      hours = Number(String(this.timeValue).split(':')[0]);
      minutes = Number(String(this.timeValue).split(':')[1]);
    } else {
      console.log('timestamp is NOT NaN');
      hours = this.timeValue.getHours()
      minutes = this.timeValue.getMinutes()
    }
    
    console.log('getHours = ' + hours);
    console.log('getMinutes = ' + minutes);
    promotionFinalDate.setHours(hours, minutes)
    console.log('promotionFinalDate = ' + promotionFinalDate);
    this.promotionsService.createPromotionForProducts(this.dataSource.data, promotionFinalDate, this.value);
    // promotionsService.crea
    this.dialogRef.close(true);
  }
}