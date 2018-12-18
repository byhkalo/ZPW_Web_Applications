import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as io from 'socket.io-client';

@Injectable({providedIn:"root"})
export class WebSocketService {


    private socket;

    private productsUpdateObservable = new BehaviorSubject<boolean>(false);
    private serverTypeUpdateObservable = new BehaviorSubject<boolean>(false);
    
    constructor() {
        this.connect()
    }

    connect() {
        console.log('try to connect to socket Server')
        let webSocketUrl = 'http://localhost:5000/'
        this.socket = io(webSocketUrl);

        this.socket.on('products', data => {
            console.log('Socket Execute PPRODUCTS!!! = - =- ')
            console.log('data = ')
            console.log(data)
            this.productsUpdateObservable.next(true)
        })
        this.socket.on('serverSetting', data => {
            console.log('Socket Execute SERVER TYPE!!! = - =- ')
            console.log('data = ')
            console.log(data)
            this.serverTypeUpdateObservable.next(true)
        })
    }

    getProductsUpdateObservable(): BehaviorSubject<boolean> {
        return this.productsUpdateObservable;
    }
    getserverTypeUpdateObservable(): BehaviorSubject<boolean> {
        return this.serverTypeUpdateObservable;
    }
 }