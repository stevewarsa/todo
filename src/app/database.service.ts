import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _loggedInUser: string = null;
  private _url:string = "http://ps11911.com/todo/server/";

  constructor(private httpService: HttpClient) { }

  public set loggedInUser(user: string) {
    this._loggedInUser = user;
  }

  public get loggedInUser(): string {
    return this._loggedInUser;
  }

  public doLogin(loginParam: any): Observable<any> {
    return this.httpService.post(`${this._url}login.php`, loginParam);
  }
}
