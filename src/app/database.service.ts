import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _loggedInUser: string = null;
  private _url: string = "http://ps11911.com/todo/server/";

  private _editingTodo: Todo = null;

  constructor(private httpService: HttpClient) { }

  public set loggedInUser(user: string) {
    this._loggedInUser = user;
  }

  public get loggedInUser(): string {
    return this._loggedInUser;
  }

  public set editingTodo(td: Todo) {
    this._editingTodo = td;
  }

  public get editingTodo(): Todo {
    return this._editingTodo;
  }

  public doLogin(loginParam: any): Observable<any> {
    return this.httpService.post(`${this._url}login.php`, loginParam);
  }

  public getTodos(): Observable<Todo[]> {
    return this.httpService.get<Todo[]>(`${this._url}get_todos.php`);
    // return Observable.create(observer => {
    //   let copiedList: Todo[] = [];
    //   DatabaseService.todos.forEach(td => copiedList.push(Object.assign({}, td)));
    //   observer.next(copiedList);
    // });
  }

  public addTodo(todo: Todo): Observable<Todo> {
    return this.httpService.post<Todo>(`${this._url}add_todo.php`, todo);
    // return Observable.create(observer => {
    //   let newId: number = DatabaseService.todos[DatabaseService.todos.length - 1].id + 1;
    //   let newTodo: Todo = <Todo>{
    //     id: newId,
    //     category: todo.category,
    //     title: todo.title,
    //     description: todo.description
    //   };
    //   DatabaseService.todos.push(newTodo);
    //   observer.next(newTodo);
    // });
  }

  public editTodo(todo: Todo): Observable<Todo> {
    return this.httpService.post<Todo>(`${this._url}add_todo.php`, todo);
    // return Observable.create(observer => {
    //   DatabaseService.todos.forEach(td => {
    //     if (td.id === todo.id) {
    //       td.category = todo.category;
    //       td.description = todo.description;
    //       td.status = todo.status;
    //       td.title = todo.title;
    //     }
    //   });
    //   observer.next("success");
    // });
  }
}
