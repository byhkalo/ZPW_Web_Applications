import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Order } from "src/models/order.model";
import { Product } from "src/models/product.model";

const imageUrl = 'https://store.storeimages.cdn-apple.com/4667/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=470&hei=556&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1472430205982'

export class OrdersTableDS extends MatTableDataSource<Order> {
    constructor(data: Order[], paginator: MatPaginator, sort: MatSort) {
      if (data != null) {
        super(data);
      } else {
        super([]);
      }
      this.sort = sort;
      this.paginator = paginator;
    }
  }