import { Injectable } from "@angular/core";
import { Promotion } from "src/models/promotion.model";
import { BehaviorSubject } from "rxjs";
import { TimeState } from "src/models/time.state.model";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireList } from "@angular/fire/database/interfaces";
import { Product } from "src/models/product.model";
import { ProductsService } from "./products.service";

@Injectable({providedIn:"root"})
export class PromotionsService {
    private promotions: Map<String, Promotion> = new Map();
    private allPromotions: Array<Promotion> = [];

    private promotionsObservable: BehaviorSubject<Array<Promotion>> = new BehaviorSubject([])
    private promotionTimers: Map<string, NodeJS.Timer> = new Map();
    private promotionTimeHandlers: Map<string, BehaviorSubject<TimeState>> = new Map();

    private promotionsQuery: AngularFireList<Promotion> 

    constructor(private fireDatabase: AngularFireDatabase, private productsService: ProductsService) {
        this.promotionsQuery = fireDatabase.list<Promotion>('promotions')
        this.promotionsQuery.valueChanges().subscribe(promotions => {
            this.allPromotions = promotions
            this.updatePromotions();
            this.promotionsObservable.next(promotions);
        })
    }
    private updatePromotions() {
        this.promotions.clear
        this.allPromotions.forEach(promotion => {
            this.promotions.set(promotion.id, promotion);
            this.updateTimerForPromotion(promotion)
        });
    }

    private updateTimerForPromotion(promotion: Promotion) {
        if (this.promotionTimers.has(promotion.id)){
            clearInterval(this.promotionTimers.get(promotion.id))
            this.promotionTimers.delete(promotion.id)
        }    
        let _this = this
        let timeinterval = setInterval(function(){
            let currentDate = Math.floor(Date.now() /1000);
            var t = promotion.untilTimestamp - currentDate;
            var seconds = Math.floor( (t) % 60 );
            var minutes = Math.floor( (t/60) % 60 );
            var hours = Math.floor( (t/(60*60)) % 24 );
            var days = Math.floor( t/(60*60*24) );
            let timeState: TimeState = { total: t, days: days, hours: hours, 
            minutes: minutes, seconds: seconds , isActive : t>0, promotion: promotion};
            _this.getObservablePromotion(promotion.id).next(timeState)
            console.log('tick ' + t);
            if(timeState.total<0){
                // this.timeinterval = null;
                // this.timeinterval = 
                _this.promotionsObservable.next(_this.allPromotions);
                clearInterval(_this.promotionTimers.get(promotion.id))
                _this.promotionTimers.delete(promotion.id)
            }
        },1000);
        this.promotionTimers.set(promotion.id, timeinterval);
    }

    getPromotionById(promotionId: string): Promotion | null {
        if (this.promotions.has(promotionId)) {
            let promotion = this.promotions.get(promotionId);
            let currentDate = Math.floor(Date.now() /1000);
            if (promotion.untilTimestamp > currentDate) {
                return promotion;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    isExistPromotion(promotionId: string) {
        return this.getPromotionById(promotionId) != null;
    }

    getPromotionsObservable(): BehaviorSubject<Array<Promotion>> {
        return this.promotionsObservable;
    }
    getObservablePromotion(promotionId: string): BehaviorSubject<TimeState> {
        if (!this.promotionTimeHandlers.has(promotionId)) {
            let promotion = this.promotions.get(promotionId)
            let timeState = { total: 0, days: 0, hours: 0, minutes: 0, 
                seconds: 0 , isActive : false, promotion: promotion};
            this.promotionTimeHandlers.set(promotionId, new BehaviorSubject<TimeState>(timeState));
        }
        return this.promotionTimeHandlers.get(promotionId);
    }

    createPromotionForProducts(products: Product[], date: Date, discount: number) {
        console.log('createPromotionForProducts')
        var newPromotion = new Promotion()
        newPromotion.id = this.fireDatabase.createPushId()
        newPromotion.untilTimestamp = Math.floor(date.valueOf() /1000);
        newPromotion.discount = discount;
        this.promotionsQuery.update(newPromotion.id, newPromotion);
        products.forEach(element => {
            this.productsService.activatePromotionForProduct(element, newPromotion.id)
        })
    }
}   