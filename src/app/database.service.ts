import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _loggedInUser: string = null;
  private _url:string = "http://ps11911.com/todo/server/";

  private static todos: Todo[] = [
    <Todo>{
      category: 'Nuggets', 
      title: 'Nuggets frequency categories', 
      description: 'There should be 3 categories: "Just Added", "Practice Daily", "Maintenance Mode"'
    },
    <Todo>{
      category: 'Links', 
      title: 'Export links for import into custom search engine', 
      description: null
    },
    <Todo>{
      category: 'Worship Team Tool', 
      title: 'Changing Special Worship Days', 
      description: 'When changing (or deleting) special worship days, make sure to update or remove people assigned to those days'
    },
    <Todo>{
      category: 'Bridgeway Web Site', 
      title: 'Prevent contact form spam', 
      description: 'Need to implement some strategy to prevent contact form SPAM on our website.  Start with this article https://www.industrialmarketer.com/how-to-handle-web-form-spam/'
    }
  ];

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

  public getTodos(): Observable<Todo[]> {
    return Observable.create(observer => {
      observer.next(DatabaseService.todos);
    });
  }
}
