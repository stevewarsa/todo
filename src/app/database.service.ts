import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { TodoParam } from './todo-param';
import { UserParam } from './user-param';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _loggedInUser: string = null;
  private _url: string = "http://localhost:8080/todo/server/";

  private _editingTodo: Todo = null;

  constructor(private httpService: HttpClient) { 
    if (environment.production) {
      this._url = "/todo/server/";
    }
    console.log("Using url: " + this._url);
  }

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

  public doLogin(loginParam: any): Observable<string> {
    return this.httpService.post<string>(`${this._url}login.php`, loginParam);
  }

  public changePassword(changePasswordParam: any): Observable<string> {
    return this.httpService.post<string>(`${this._url}change_password.php`, changePasswordParam);
  }

  public getTodos(userParam: UserParam): Observable<Todo[]> {
    return this.httpService.post<Todo[]>(`${this._url}get_todos.php`, userParam);
  }

  public getDeletedTodos(userParam: UserParam): Observable<Todo[]> {
    return this.httpService.post<Todo[]>(`${this._url}get_deleted_todos.php`, userParam);
  }

  public getCategories(userParam: UserParam): Observable<string[]> {
    return this.httpService.post<string[]>(`${this._url}get_categories.php`, userParam);
  }

  public getUsers(): Observable<string[]> {
    return this.httpService.get<string[]>(`${this._url}get_users.php`);
  }

  public addTodo(todoParam: TodoParam): Observable<Todo> {
    return this.httpService.post<Todo>(`${this._url}add_todo.php`, todoParam);
  }

  public editTodo(todoParam: TodoParam): Observable<Todo> {
    return this.httpService.post<Todo>(`${this._url}add_todo.php`, todoParam);
  }

  public deleteTodo(todoParam: TodoParam): Observable<string> {
    return this.httpService.post<string>(`${this._url}delete_todo.php`, todoParam);
  }
}
