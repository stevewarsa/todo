import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../todo';

@Component({
  templateUrl: './view-edit-todo.component.html',
  styleUrls: ['./view-edit-todo.component.css']
})
export class ViewEditTodoComponent implements OnInit {
  private currentUser: string = null;
  todo: Todo = new Todo();
  initializing: boolean = false;
  initializingMessage: string = null;

  constructor(private databaseService: DatabaseService, private route: Router) { }

  ngOnInit() {
    this.currentUser = this.databaseService.loggedInUser;
    if (!this.currentUser || !this.databaseService.editingTodo) {
      // user not logged in or no todo present, so re-route to login
      this.route.navigate(['']);
      return;
    }
    this.todo = this.databaseService.editingTodo;
  }

  updateTodo() {
    this.initializing = true;
    this.initializingMessage = "Saving changes to TODO...";
    this.databaseService.editTodo(this.todo).subscribe((todo: Todo) => {
      this.initializing = false;
      this.initializingMessage = null;
      this.route.navigate(['main']);
    });
  }
}
