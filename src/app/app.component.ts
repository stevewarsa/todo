import { Component } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router, NavigationStart, Event } from '@angular/router';

@Component({
  selector: 'td-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currUser: string = null;

  constructor(private databaseService: DatabaseService, private route: Router) {
    route.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log(event.url);
        this.currUser = databaseService.loggedInUser;
      }
    });
  }

  ngOnInit() {
    this.currUser = this.databaseService.loggedInUser;
  }
}
