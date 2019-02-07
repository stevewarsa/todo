import { TodoParam } from './../todo-param';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Todo } from '../todo';
import { UserParam } from '../user-param';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './todo-table.component.html',
  styleUrls: ['./todo-table.component.css']
})
export class TodoTableComponent implements OnInit {
  listOfTodos: Todo[] = [];
  filteredTodos: Todo[] = [];
  filterText: string = null;
  filterCategory: string = "NOSELECTION";
  mobile: boolean = false;
  private MAX_LEN: number = 50;
  private currUser: string = null;
  newCategory: string = null;
  initializing: boolean = false;
  initializingMessage: string = null;
  errorMessage: string = null;
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
    let catObs = this.databaseService.getCategories(<UserParam>{uid: this.currUser});
    let tdObs = this.databaseService.getTodos(<UserParam>{uid: this.currUser});
    forkJoin([catObs, tdObs]).subscribe((response: any[]) => {
      let cats = response[0];
      if (typeof cats === 'string') {
        if (cats.startsWith("error|")) {
          console.log(cats.split("|")[1]);
          this.errorMessage = cats.split("|")[1];
        }
      } else {
        if (!cats.includes("Default")) {
          cats.push("Default");
        }
        this.categories = cats.sort();
      }
      let todos = response[1];
      if (typeof todos === 'string') {
        if (todos.startsWith("error|")) {
          console.log(todos.split("|")[1]);
          if (this.errorMessage) {
            this.errorMessage += ", " + todos.split("|")[1];
          } else {
            this.errorMessage = todos.split("|")[1];
          }
        }
      } else {
        this.listOfTodos = (todos as Todo[]).sort((a: Todo, b: Todo) => {
          return b.id - a.id;
        });
        this.listOfTodos.forEach(td => {
          this.filteredTodos.push(Object.assign({}, td));
        });
      }
      this.initializing = false;
    });
  }

  viewAddForm() {
    this.showAddForm = true;
    this.newCategory = null;
    this.todoToAdd.title = null;
    this.todoToAdd.category = "Default";
    this.todoToAdd.description = null;
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
    this.databaseService.addTodo(<TodoParam>{uid: this.currUser,todo: this.todoToAdd}).subscribe((returnedTodo: any) => {
      if (typeof returnedTodo === 'string') {
        if (returnedTodo.startsWith("error|")) {
          console.log(returnedTodo.split("|")[1]);
        }
      } else {
        this.listOfTodos.unshift(returnedTodo);
        this.filteredTodos.unshift(Object.assign({}, returnedTodo));
        if (!this.categories.includes(returnedTodo.category)) {
          this.categories.push(returnedTodo.category);
          this.categories = this.categories.sort();
        }
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
    this.filterCategory = "NOSELECTION";
    this.filteredTodos = this.listOfTodos.filter(td => {
      for (let field of ["category", "title", "description"]) {
        if (td[field] && td[field].toUpperCase().includes(searchString)) {
          return true;
        }
      }
      return false;
    });
  }

  onFilterCategory(category: string) {
    this.filteredTodos = [];
    this.listOfTodos.forEach(td => this.filteredTodos.push(Object.assign({}, td)));
    if (category !== "NOSELECTION") {
      this.filteredTodos = this.filteredTodos.filter(td => {
        return td.category === category;
      });
    }
  }

  shorten(description: string): string {
    if (description.length > this.MAX_LEN) {
      return description.substring(0, this.MAX_LEN - 3) + "...";
    } else {
      return description;
    }
  }
}
