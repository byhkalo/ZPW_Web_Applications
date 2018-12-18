import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, observable, Subscription } from "rxjs";
import { User } from "src/models/user.model";
import { AngularFireDatabase } from "@angular/fire/database";
import { auth } from "firebase";

@Injectable({providedIn: 'root'})

export class AuthService {
    constructor(private firebaseAuth: AngularFireAuth, private firebaseDatabase: AngularFireDatabase) {}

    currentUserSubscription: Subscription | null;
    currentUser: User | null;

    logInWithEmailAndPassword(email: string, password: string): Observable<firebase.User> {
        return new Observable(observable => {
            const session = auth.Auth.Persistence.SESSION
            this.firebaseAuth.auth.setPersistence(session).then(() => {
                this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then(credential => {
                    console.log('CREDENTIAN = ' + credential)
                    if (credential.user != null) {
                        this.connectToCurrentUser(credential.user.providerId);
                    }
                    observable.next(credential.user);
                }).catch(error => {
                    console.log('catch ERROR' + error);
                });
            });
        });
    }

    private connectToCurrentUser(providerId: String) {
        this.currentUserSubscription = this.firebaseDatabase.object<User>('users/'+providerId)
        .valueChanges().subscribe(dbUser => {
            this.currentUser = dbUser;
        });
    }

    authState(): Observable<firebase.User | null> {
        return this.firebaseAuth.authState;
    }

    logOut() {
        this.currentUser = null;
        this.currentUserSubscription.unsubscribe
        this.currentUserSubscription = null;
        this.firebaseAuth.auth.signOut();
    }

    isProductsAccessed(): boolean {
        if (this.currentUser != null) {
            return this.currentUser.isProductsAccessed
        }
        return false;
    }

    isOrdersAccessed(): boolean {
        if (this.currentUser != null) {
            return this.currentUser.isOrdersAccessed
        }
        return false;
    }

    isUsersAccessed(): boolean {
        if (this.currentUser != null) {
            return this.currentUser.isUsersAccessed
        }
        return false;
    }

    isLoggedInApplication(): boolean {
        console.log('Firebase User' + this.firebaseAuth.auth.currentUser);
        return (this.firebaseAuth.auth.currentUser != null);
    }

}