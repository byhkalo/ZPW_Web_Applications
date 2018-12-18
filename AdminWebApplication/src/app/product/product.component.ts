import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Product } from 'src/models/product.model';
import { Category } from 'src/models/category.model';
import { ProductsService } from 'src/services/products.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product
  isUpdate: boolean
  categories: Category[] = [{id: 2, name: 'Smartphones'}, {id: 2, name: 'Laptops'}, {id: 2, name: 'Monitors'}, {id: 2, name: 'Accessories'}];

  productName: string
  productDescription: string
  productCategory: string
  productCount: number
  productPrice: number
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product | null, private productsService: ProductsService, 
    private afStorage: AngularFireStorage, public dialogRef: MatDialogRef<ProductComponent>) { 
    this.product = data ? data : new Product();
    this.isUpdate = data != null;

    this.productName = this.product.name;
    this.productDescription = this.product.description;
    console.log('Categoty = ' + this.product.category)
    this.productCategory = this.product.category;
    this.productCount = this.product.count;
    this.productPrice = this.product.price;
  }

  ngOnInit() {
  }

  updateProduct() {
    console.log('updateProduct name = ' + this.productName);
    console.log('updateProduct = ' + this.productName);
    this.productsService.updateProduct(this.product, this.productName, this.productDescription, 
      this.productCategory, this.productCount, this.productPrice)
  }
  createProduct() {
    this.productsService.createNewProduct(this.productName, this.productDescription, 
      this.productCategory, this.productCount, this.productPrice)
  }
  deleteProduct() {
    this.productsService.deleteProduct(this.product)
  }
  optionChanged(event) {
    this.productCategory = event.value
    console.log('new Value', event.value);
  }

  private fileToUpload: File | null = null;
  prepareToUpload(event) {
    this.fileToUpload = event.target.files[0]
  }

  uploadFile() {
    if (!this.isUpdate) {
      alert("You have to create product firstly")
    } else if (this.fileToUpload != null) {
      this.productsService.updateProductByImageFile(this.product, this.fileToUpload);  
    } else {
      alert("Please choose image file")
    }
  }
}
