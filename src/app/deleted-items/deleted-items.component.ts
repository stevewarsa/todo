import { DatabaseService } from './../database.service';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { Router } from '@angular/router';
import { UserParam } from '../user-param';
import * as moment from 'moment';

@Component({
  templateUrl: './deleted-items.component.html',
  styleUrls: ['./deleted-items.component.css']
})
export class DeletedItemsComponent implements OnInit {
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
  showAddForm: boolean = false;
  todoToAdd: Todo = new Todo();
  categories: string[] = [];

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
    this.databaseService.getDeletedTodos(<UserParam>{uid: this.currUser}).subscribe((todos: any) => {
      if (typeof todos === 'string') {
        if (todos.startsWith("error|")) {
          console.log(todos.split("|")[1]);
        }
      } else {
        this.updateDateFromUTCToLocal(todos);
        this.listOfTodos = todos;
        let tmpCategories: string[] = [];
        this.listOfTodos.forEach(td => {
          this.filteredTodos.push(Object.assign({}, td));
          if (!tmpCategories.includes(td.category)) {
            tmpCategories.push(td.category);
          }
        });
        this.categories = tmpCategories.sort();
      }
      this.initializing = false;
    });
  }

  private updateDateFromUTCToLocal(todos: Todo[]) {
    todos.forEach(td => {
      if (td.hasOwnProperty('dateDeleted') && td['dateDeleted']) {
        let offset: number = moment().utcOffset();
        let localDt: string = moment.utc(td['dateDeleted']).utcOffset(offset).format('ddd, MMM D, YYYY h:mm A');
        td['dateDeleted'] = localDt;
      }
    });
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
