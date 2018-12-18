import { Injectable } from "@angular/core";
import { Order } from "src/models/order.model";
import { Product } from "src/models/product.model";
import { BehaviorSubject } from "rxjs";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

@Injectable({providedIn: 'root'})

export class OrdersService {
    
    private unmanagedOrdersObservable: BehaviorSubject<Array<Order>> = new BehaviorSubject([]);
    private unmanagedQuery: AngularFireList<Order>
    private inProcessOrdersObservable: BehaviorSubject<Array<Order>> = new BehaviorSubject([]);
    private inProcessQuery: AngularFireList<Order>
    private completedOrdersObservable: BehaviorSubject<Array<Order>> = new BehaviorSubject([]);
    private completedQuery: AngularFireList<Order>

    constructor(private fireDatabase: AngularFireDatabase) {
        this.unmanagedQuery = fireDatabase.list<Order>('orders/unmanaged');
        this.unmanagedQuery.valueChanges().subscribe(unmanagedOrders => {
            this.unmanagedOrdersObservable.next(unmanagedOrders);
        });
        this.inProcessQuery = fireDatabase.list<Order>('orders/inProcess');
        this.inProcessQuery.valueChanges().subscribe(inProcessOrders => {
            this.inProcessOrdersObservable.next(inProcessOrders);
        });
        this.completedQuery = fireDatabase.list<Order>('orders/completed');
        this.completedQuery.valueChanges().subscribe(completedOrders => {
            this.completedOrdersObservable.next(completedOrders);
        });
    }

    getUnmanagedOrders(): BehaviorSubject<Array<Order>> {
        return this.unmanagedOrdersObservable;
    }
    getInProcessOrders(): BehaviorSubject<Array<Order>> {
        return this.inProcessOrdersObservable;
    }
    getCompletedOrders(): BehaviorSubject<Array<Order>> {
        return this.completedOrdersObservable;
    }
    // Unmanaged Orders
    updateUnmanagedOrder(order: Order, completedProducts: Product[], category: string) {
        order.completness = order.products.map(element => {
            return completedProducts.includes(element)
        })
        if (category != order.category) {
            this.moveOrderToCategory(order, category)
        } else {
            this.unmanagedQuery.update(order.id, order)
        }
    }
    removeUnmanagedOrder(order: Order) {
        this.unmanagedQuery.remove(order.id)
    }
    setUnmanagedOrder(order: Order) {
        this.unmanagedQuery.set(order.id, order)
    }
    // In Process Orders
    updateInProcessOrder(order: Order, completedProducts: Product[], category: string) {
        order.completness = order.products.map(element => {
            return completedProducts.includes(element)
        })
        console.log('COMPLETNESS = ' + order.completness)
        if (category != order.category) {
            this.moveOrderToCategory(order, category)
        } else {
            this.inProcessQuery.update(order.id, order)
        }
    }
    removeInProcessOrder(order: Order) {
        this.inProcessQuery.remove(order.id)
    }
    setInProcessOrder(order: Order) {
        this.inProcessQuery.set(order.id, order)
    }
    // Completed Orders
    updateCompletedOrder(order: Order, completedProducts: Product[], category: string) {
        order.completness = order.products.map(element => {
            return completedProducts.includes(element)
        })
        if (category != order.category) {
            this.moveOrderToCategory(order, category)
        } else {
            this.completedQuery.update(order.id, order)
        }
    }
    removeCompletedOrder(order: Order) {
        this.completedQuery.remove(order.id)
    }
    setCompletedOrder(order: Order) {
        this.completedQuery.set(order.id, order)
    }

    private moveOrderToCategory(order: Order, category: string) {
        if (order.category == category) { return }
        let oldCategory = order.category
        order.category = category
        switch (category) {
            case 'Unmanaged': this.setUnmanagedOrder(order); break;
            case 'In Process': this.setInProcessOrder(order); break;
            case 'Completed': this.setCompletedOrder(order); break;
        }
        switch (oldCategory) {
            case 'Unmanaged': this.removeUnmanagedOrder(order); break;
            case 'In Process': this.removeInProcessOrder(order); break;
            case 'Completed': this.removeCompletedOrder(order); break;
        }
    }
}