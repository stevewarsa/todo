import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Todo } from '../todo';

@Component({
  templateUrl: './todo-table.component.html',
  styleUrls: ['./todo-table.component.css']
})
export class TodoTableComponent implements OnInit {
  listOfTodos: Todo[] = [];
  filteredTodos: Todo[] = [];
  mobile: boolean = false;
  private MAX_LEN: number = 50;
  private currUser: string = null;
  initializing: boolean = false;
  initializingMessage: string = null;
  showAddForm: boolean = false;
  todoToAdd: Todo = new Todo();
  viewingTodo: Todo = null;
  editingTodo: boolean = false;

  constructor(private databaseService: DatabaseService, private route: Router) {}

  ngOnInit() {
    this.currUser = this.databaseService.loggedInUser;
    if (!this.currUser) {
      // user not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    if (window.screen.width < 700) { // 768px portrait
      this.mobile = true;
    }
    this.initializing = true;
    this.initializingMessage = "Initializing list of TODOs...";
    this.databaseService.getTodos().subscribe((todos: Todo[]) => {
      this.listOfTodos = todos;
      this.listOfTodos.forEach(td => this.filteredTodos.push(Object.assign({}, td)));
      this.initializing = false;
    });
  }

  addTodo() {
    this.initializing = true;
    if (this.editingTodo) {
      // don't add a new TODO, because we're editing an existing one
      this.initializingMessage = "Saving changes to TODO...";
      this.databaseService.editTodo(this.todoToAdd).subscribe((response: string) => {
        this.listOfTodos.forEach(td => {
          if (td.id === this.todoToAdd.id) {
            this.updateFrom(this.todoToAdd, td);  
          }
        });
        this.filteredTodos.forEach(td => {
          if (td.id === this.todoToAdd.id) {
            this.updateFrom(this.todoToAdd, td);  
          }
        });
        this.cleanupAfterAddEditForm();
      });
    } else {
      this.initializingMessage = "Adding new TODO...";
      this.databaseService.addTodo(this.todoToAdd).subscribe((returnedTodo: Todo) => {
        this.listOfTodos.push(returnedTodo);
        this.filteredTodos.push(Object.assign({}, returnedTodo));
        this.cleanupAfterAddEditForm();
      });
    }
  }

  private updateFrom(fromTodo: Todo, to: Todo) {
    to.category = fromTodo.category;
    to.description = fromTodo.description;
    to.status = fromTodo.status;
    to.title = fromTodo.title;  
  }
  private cleanupAfterAddEditForm() {
    this.todoToAdd = new Todo();
    this.showAddForm = false;
    if (this.editingTodo) {
      this.editingTodo = false;
      this.viewingTodo = null;
    }
    this.initializing = false;
    this.initializingMessage = null;
  }

  editTodo(viewingTodo: Todo) {
    // clone it...
    this.todoToAdd = Object.assign({}, viewingTodo);
    this.showAddForm = true;
    this.editingTodo = true;
  }

  filterItems(event: any) {
    let searchString = event.target.value.toUpperCase();
    this.filteredTodos = this.listOfTodos.filter(td => {
      for (let field of ["category", "title", "description"]) {
        if (td[field] && td[field].toUpperCase().includes(searchString)) {
          return true;
        }
      }
      return false;
    });
  }

  shorten(description: string): string {
    if (description.length > this.MAX_LEN) {
      return description.substring(0, this.MAX_LEN - 3) + "...";
    } else {
      return description;
    }
  }
}
