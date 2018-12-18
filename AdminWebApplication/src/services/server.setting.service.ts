import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WebSocketService } from "./web.socket.service";
import { ServerSetting } from "src/models/server.setting.model";

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    //   'Authorization': 'my-auth-token'
    })
  };
@Injectable({providedIn:"root"})
export class ServerSettingService {
    private serverTypeFirebase: boolean | null = null;
    private serverTypeFirebaseObservable = new BehaviorSubject(this.serverTypeFirebase)

    constructor(private http: HttpClient, private socketService: WebSocketService) {
        socketService.getserverTypeUpdateObservable().subscribe(isFirebaseServer => {
            this.requestServerType()
        })
        
    }

    requestServerType() {
        this.http.get('http://localhost:5000/serverTypeFirebase')
        .subscribe((response: {serverTypeFirebase:boolean}) => {
            console.log('server RESPONSE = ' + response.serverTypeFirebase);
            this.serverTypeFirebase = response.serverTypeFirebase;
            this.serverTypeFirebaseObservable.next(response.serverTypeFirebase);
        });
    }

    getServerTypeFirebaseObservable(): BehaviorSubject<boolean | null> {
        return this.serverTypeFirebaseObservable;
    }
    isFirebaseServer(): Boolean | null {
        return this.serverTypeFirebase;
    }

    setServerType(isFirebase: boolean) {
        let serverSetting: ServerSetting = {serverTypeFirebase: isFirebase}
        this.http.post<ServerSetting>('http://localhost:5000/serverTypeFirebase', serverSetting, httpOptions).subscribe(response => {
            console.log('Server POST response' + response);
        })
    }
}