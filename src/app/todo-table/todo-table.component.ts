import {TodoParam} from '../todo-param';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../database.service';
import {Router} from '@angular/router';
import {Todo} from '../todo';
import {UserParam} from '../user-param';
import {forkJoin} from 'rxjs';

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
  filterPriority: number = -1;
  prioritySort: boolean = false;

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
        this.doDefaultSort(todos);
      }
      this.initializing = false;
    });
  }

  private doDefaultSort(todos) {
    this.prioritySort = true;
    this.listOfTodos = (todos as Todo[]).sort((a, b) => a.priority - b.priority);
    this.listOfTodos.forEach(td => {
      this.filteredTodos.push(Object.assign({}, td));
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
    this.databaseService.editingTodo = Object.assign({}, td);
    this.route.navigate(['view']);
  }

  filterItems(event: any) {
    this.filterText = event.target.value.toUpperCase();
    this.doFilter();
  }

  onFilterCategory(evt: any) {
    this.filterCategory = evt.target.value;
    this.doFilter();
  }

  shorten(description: string): string {
    if (description.length > this.MAX_LEN) {
      return description.substring(0, this.MAX_LEN - 3) + "...";
    } else {
      return description;
    }
  }

  onFilterPriority(evt: any) {
    this.filterPriority = parseInt(evt.target.value);
    this.doFilter();
  }

  private doFilter() {
    let locFilteredTodos = [];
    this.listOfTodos.forEach(td => locFilteredTodos.push(Object.assign({}, td)));
    if (this.filterText && this.filterText.trim() !== "") {
      locFilteredTodos = locFilteredTodos.filter(td => {
        for (let field of ["category", "title", "description"]) {
          if (td[field] && td[field].toUpperCase().includes(this.filterText)) {
            return true;
          }
        }
        return false;
      });
    }
    if (this.filterCategory && this.filterCategory !== "NOSELECTION") {
      locFilteredTodos = locFilteredTodos.filter(td => {
        return td.category === this.filterCategory;
      });
    }
    if (this.filterPriority !== -1) {
      locFilteredTodos = locFilteredTodos.filter(td => {
        return td.priority === this.filterPriority;
      });
    }
    this.filteredTodos = locFilteredTodos;
  }

  doSort() {
    if (this.prioritySort) {
      // clear sort
      this.prioritySort = false;
      this.filteredTodos = [];
      this.doDefaultSort(this.listOfTodos);
    } else {
      this.prioritySort = true;
      this.filteredTodos = this.filteredTodos.sort((a, b) => a.priority - b.priority);
    }
  }
}
