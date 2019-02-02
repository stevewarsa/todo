import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  newCategory: string = null;
  initializing: boolean = false;
  initializingMessage: string = null;
  showAddForm: boolean = false;
  todoToAdd: Todo = new Todo();
  categories: string[] = [];
  @ViewChild('titleInput') titleInput: ElementRef;

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
      this.listOfTodos.forEach(td => {
        this.filteredTodos.push(Object.assign({}, td));
        if (!this.categories.includes(td.category)) {
          this.categories.push(td.category);
        }
      });
      this.initializing = false;
    });
  }

  viewAddForm() {
    this.showAddForm = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 100);
  }

  addTodo() {
    this.initializing = true;
    this.initializingMessage = "Adding new TODO...";
    // if the new category exists, overwrite the existing category with it
    if (this.newCategory && this.newCategory.trim().length > 2) {
      this.todoToAdd.category = this.newCategory.trim();
    }
    this.databaseService.addTodo(this.todoToAdd).subscribe((returnedTodo: Todo) => {
      this.listOfTodos.push(returnedTodo);
      this.filteredTodos.push(Object.assign({}, returnedTodo));
      if (!this.categories.includes(returnedTodo.category)) {
        this.categories.push(returnedTodo.category);
      }
      this.cleanupAfterAddEditForm();
    });
  }

  private cleanupAfterAddEditForm() {
    this.todoToAdd = new Todo();
    this.showAddForm = false;
    this.initializing = false;
    this.initializingMessage = null;
  }

  editTodo(td: Todo) {
    // clone it...
    let toEdit: Todo = Object.assign({}, td);
    this.databaseService.editingTodo = toEdit;
    this.route.navigate(['view']);
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
