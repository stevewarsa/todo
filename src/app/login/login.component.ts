import { Component, OnInit } from '@angular/core';
import { CookieUtils } from '../cookie-utils';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showInitializing: boolean = false;
  showLoggingIn: boolean = false;
  userId: string = null;
  password: string = null;
  rememberMe = false;
  errorMessage: string = null;

  constructor(private databaseService: DatabaseService, private route: Router) { }

  ngOnInit() {
    //this.showInitializing = true;
    let cookieUserId: string = CookieUtils.getCookie('user.pwd');
    let cookiePassword: string = CookieUtils.getCookie('user.pwd');
    if (cookieUserId && cookiePassword) {
      this.userId = cookieUserId;
      this.password = cookiePassword;
      this.login();
    }
  }

  login() {
    this.databaseService.loggedInUser = this.userId;
    this.showLoggingIn = true;
    if (this.rememberMe) {
      // write cookie so they won't have to login next time
      console.log("Writing out cookies for automatic login");
      CookieUtils.setCookie('user.id', this.userId, 999);
      CookieUtils.setCookie('user.pwd', this.password, 999);
    }
    this.route.navigate(['main']);
  }
}
