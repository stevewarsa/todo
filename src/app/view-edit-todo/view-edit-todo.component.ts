import {ModalHelperService} from '../modal-helper.service';
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {Router} from '@angular/router';
import {Todo} from '../todo';
import {UserParam} from '../user-param';
import {TodoParam} from '../todo-param';

@Component({
  templateUrl: './view-edit-todo.component.html',
  styleUrls: ['./view-edit-todo.component.css']
})
export class ViewEditTodoComponent implements OnInit {
  private currentUser: string = null;
  todo: Todo = new Todo();
  initializing: boolean = false;
  initializingMessage: string = null;
  errorMessage: string = null;
  categories: string[] = [];
  newCategory: string = null;
  pi = parseInt;

  constructor(private databaseService: DatabaseService, private route: Router, private modalHelperService: ModalHelperService) { }

  ngOnInit() {
    this.currentUser = this.databaseService.loggedInUser;
    if (!this.currentUser || !this.databaseService.editingTodo) {
      // user not logged in or no todo present, so re-route to login
      this.route.navigate(['']);
      return;
    }
    this.todo = this.databaseService.editingTodo;
    this.initializing = true;
    this.initializingMessage = "Retrieving categories...";
    this.databaseService.getCategories(<UserParam>{uid: this.currentUser}).subscribe((categories:any) => {
      if (typeof categories === 'string') {
        if (categories.startsWith("error|")) {
          console.log(categories.split("|")[1]);
        }
      } else {
        this.categories = categories;
      }
      this.initializing = false;
      this.initializingMessage = null;
    });
  }

  updateNewCategory(event: any) {
    console.log(event);
    let val: string = event.target.value;
    if (val && val.trim().length > 2) {
      // wipe out the value of the existing category
      this.todo.category = "NOSELECTION";
    }
  }

  updateTodo() {
    this.initializing = true;
    this.initializingMessage = "Saving changes to TODO...";
    // if the user has entered a new category, overwrite existing
    if (this.newCategory && this.newCategory.trim().length > 2) {
      this.todo.category = this.newCategory.trim();
    }
    this.databaseService.editTodo(<TodoParam>{uid: this.currentUser, todo: this.todo}).subscribe((todo: any) => {
      if (typeof todo === 'string') {
        if (todo.startsWith("error|")) {
          console.log(todo.split("|")[1]);
          this.errorMessage = todo.split("|")[1];
        }
      } else {
        this.route.navigate(['main']);
      }
      this.initializing = false;
      this.initializingMessage = null;
    });
  }

  deleteTodo() {
    this.modalHelperService.confirm({message: "Delete this TODO?"}).result.then(() => {
      // user answered yes
      this.initializing = true;
      this.initializingMessage = "Deleting current to TODO...";
      this.databaseService.deleteTodo(<TodoParam>{uid: this.currentUser, todo: this.todo}).subscribe((response: string) => {
        if (response === "success") {
          this.initializing = false;
          this.initializingMessage = null;
          this.route.navigate(['main']);
        } else {
          // does response start with "error|"?  If so, error message is following
          if (response.startsWith("error|")) {
            console.log(response.split("|")[1]);
            this.errorMessage = response.split("|")[1];
          } else {
            this.errorMessage = "There was an error deleting this item...";
          }
        }
      });
    },
    () => {
      // user answered no
      console.log("User chose not to save data...");
    });
  }

  updatePriority(evt: any) {
    this.todo.priority = parseInt(evt.target.value);
  }
}
