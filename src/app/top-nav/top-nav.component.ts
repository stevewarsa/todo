import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router, NavigationStart, Event } from '@angular/router';
import { CookieUtils } from '../cookie-utils';

@Component({
  selector: 'td-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  currentUser: string = null;
  mobile: boolean = false;
  expanded = false;
  isCollapsed = true;
  currentRoute: string = null;

  constructor(private databaseService: DatabaseService, private route: Router) { 
    route.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log(event.url);
        this.currentRoute = event.url;
        this.currentUser = this.databaseService.loggedInUser;
      }
    });

  }

  ngOnInit() {
    if (window.screen.width < 700) { // 768px portrait
      this.mobile = true;
    }
    this.currentUser = this.databaseService.loggedInUser;
  }


  toggleExpanded(): boolean {
    this.isCollapsed = !this.isCollapsed;
    return false;
  }

  doLogout() {
    this.toggleExpanded();
    this.databaseService.loggedInUser = null;
    CookieUtils.deleteCookie('user.id');
    CookieUtils.deleteCookie('user.pwd');
    this.route.navigate(['']);
  }}
