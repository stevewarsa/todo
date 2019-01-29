import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'td-todo-table',
  templateUrl: './todo-table.component.html',
  styleUrls: ['./todo-table.component.css']
})
export class TodoTableComponent implements OnInit {
  listOfTodos: any[] = [
    {category: 'Nuggets', title: 'Nuggets frequency categories', description: 'There should be 3 categories: "Just Added", "Practice Daily", "Maintenance Mode"'},
    {category: 'Links', title: 'Export links for import into custom search engine', description: null},
    {category: 'Worship Team Tool', title: 'Changing Special Worship Days', description: 'When changing (or deleting) special worship days, make sure to update or remove people assigned to those days'}
  ];
  filteredTodos: any[] = [];
  mobile: boolean = false;
  private MAX_LEN: number = 50;
  private currUser: string = null;

  constructor(private databaseService: DatabaseService, private route: Router) {}

  ngOnInit() {
    this.currUser = this.databaseService.loggedInUser;
    if (!this.currUser) {
      // counter not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    if (window.screen.width < 700) { // 768px portrait
      this.mobile = true;
    }
    this.listOfTodos.forEach(x => this.filteredTodos.push(Object.assign({}, x)));
  }

  filterItems(event: any) {
    this.filteredTodos = this.listOfTodos.filter(td => td.title.toUpperCase().includes(event.target.value.toUpperCase()) || (td.description && td.description.toUpperCase().includes(event.target.value.toUpperCase())));
  }

  shorten(description: string): string {
    if (description.length > this.MAX_LEN) {
      return description.substring(0, this.MAX_LEN - 3) + "...";
    } else {
      return description;
    }
  }
}
