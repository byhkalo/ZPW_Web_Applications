import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { Product } from "src/models/product.model";
import { Category } from "src/models/category.model";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { storage } from "firebase";
import { ServerSettingService } from "./server.setting.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WebSocketService } from "./web.socket.service";

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    //   'Authorization': 'my-auth-token'
    })
  };

@Injectable({providedIn: 'root'})

export class ProductsService {
    isFirebaseServerType: boolean | null = null
    private productsObservable: BehaviorSubject<Array<Product>> = new BehaviorSubject([]);
    private allProductsQuery: AngularFireList<Product> = this.fireDatabase.list<Product>('products');
    private allProductsSubscription: Subscription | null

    constructor(private fireDatabase: AngularFireDatabase, private storage: AngularFireStorage, 
        private serverSettingService: ServerSettingService, private http: HttpClient, 
        private socketService: WebSocketService) {
            socketService.getProductsUpdateObservable().subscribe(updateValue => {
                console.log('Socket call');
                if (updateValue && this.isFirebaseServerType == false) {
                    this.requestProductsFromServer();
                }
            })
            serverSettingService.getServerTypeFirebaseObservable().subscribe(isFirebase => {
                this.isFirebaseServerType = isFirebase
                if (isFirebase != null) {
                    if (isFirebase==true && this.allProductsSubscription == null) {
                        console.log('Try to connect to Firebase...');
                        this.allProductsSubscription = this.allProductsQuery
                        .valueChanges().subscribe(databaseProducts => {
                            console.log('Firebase Connected!!');
                            this.productsObservable.next(databaseProducts);
                        });
                    } else {
                        if (this.allProductsSubscription != null) {
                            console.log('Try to Unsubscribe from Firebase...');
                            this.allProductsSubscription.unsubscribe()
                            this.allProductsSubscription = null
                            console.log('Unsubscribed from Firebase');
                        }
                        this.requestProductsFromServer();            
                    }
                }
            })
        
    }

    private requestProductsFromServer() {
        console.log('Try to get products from server...');
        this.http.get<Product[]>('http://localhost:5000/products').subscribe((tempProducts) => {                            
            console.log('Get Products Response = ' + tempProducts);
            console.log('Type of answer = ' + Object.keys(tempProducts));
            this.productsObservable.next(tempProducts);
        });
    }

    getProducts(): BehaviorSubject<Array<Product>> {
        return this.productsObservable;
    }

    createNewProduct(name: string, description: string, category: string, count: number, price: number) {
        if (this.isFirebaseServerType == null) { return }
        var newProd = new Product();
        newProd.name = name;
        newProd.description = description;
        newProd.category = category;
        newProd.count = count;
        newProd.price = price;
        if (this.isFirebaseServerType == true) {
            newProd.id = this.fireDatabase.createPushId()    
            this.allProductsQuery.update(newProd.id, newProd)
        } else {
            let randomId = new Date().getTime() + Math.random().toString(36).substring(2);
            newProd.id = randomId
            console.log('Try to POST new product = ' + newProd)
            this.http.post<Product>('http://localhost:5000/products', newProd, httpOptions).subscribe(response => {
                console.log('Server POST response' + response);
            })
        }
    }

    updateProduct(product: Product, name: string, description: string, category: string, count: number, price: number) {
        if (this.isFirebaseServerType == null) { return }
        var updateProd: Product = product;
        updateProd.name = name;
        updateProd.description = description;
        updateProd.category = category;
        updateProd.count = count;
        updateProd.price = price;
        if (this.isFirebaseServerType) {
            this.allProductsQuery.update(updateProd.id, updateProd)
        } else {
            console.log('Try to PUT new product = ' + updateProd)
            this.http.put<Product>('http://localhost:5000/products', updateProd, httpOptions).subscribe(response => {
                console.log('Server POST response' + response);
            })
        }
    }

    activatePromotionForProduct(product: Product, promotionId: string) {
        if (this.isFirebaseServerType == null) { return }
        var updateProd: Product = product;
        updateProd.promotionId = promotionId;
        if (this.isFirebaseServerType) {
            this.allProductsQuery.update(updateProd.id, updateProd)
        } else {
            console.log('Try to PUT new product = ' + updateProd)
            this.http.put<Product>('http://localhost:5000/products', updateProd, httpOptions).subscribe(response => {
                console.log('Server POST response' + response);
            })
        }
    }

    deactivatePromotionForProduct(product: Product) {
        if (this.isFirebaseServerType == null) { return }
        var updateProd: Product = product;
        updateProd.promotionId = null;
        if (this.isFirebaseServerType) {
            this.allProductsQuery.update(updateProd.id, updateProd)
        } else {
            console.log('Try to PUT new product = ' + updateProd)
            this.http.put<Product>('http://localhost:5000/products', updateProd, httpOptions).subscribe(response => {
                console.log('Server POST response' + response);
            })
        }
    }

    private task: AngularFireUploadTask
    private ref: AngularFireStorageReference

    updateProductByImageFile(product: Product, file: File) {
        if (this.isFirebaseServerType == null) { return }
        let randomId = new Date().getTime() + Math.random().toString(36).substring(2);
        let name = file.name.split(' ').join('_')
        let fullPath = randomId+name;

        console.log('fullPath = ' + fullPath)
        this.ref = this.storage.ref(fullPath);
        this.task = this.ref.put(file);

        this.task.then((result) => {
        console.log('download URL = ' + this.ref.getDownloadURL())
            this.ref.getDownloadURL().subscribe(downloadUrl => {
                product.imageUrl = downloadUrl;

                if (this.isFirebaseServerType) {
                    this.allProductsQuery.update(product.id, product)
                } else {
                    console.log('Try to PUT new product = ' + product)
                    this.http.put<Product>('http://localhost:5000/products', product, httpOptions).subscribe(response => {
                        console.log('Server POST response' + response);
                    })
                }
                
            })
        })    
    }

    deleteProduct(product: Product) {
        if (this.isFirebaseServerType == null) { return }
        if (this.isFirebaseServerType) {
            this.allProductsQuery.remove(product.id);
        } else {
            console.log('Try to PUT new product = ' + product)
            this.http.delete('http://localhost:5000/products/'+product.id, httpOptions).subscribe(response => {
                console.log('Server POST response' + response);
            })
        }
    }
}