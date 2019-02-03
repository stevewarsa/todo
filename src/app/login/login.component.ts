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
  users: string[] = [];
  existingUser: string = "UNKNOWN";

  constructor(private databaseService: DatabaseService, private route: Router) { }

  ngOnInit() {
    let cookieUserId: string = CookieUtils.getCookie('user.id');
    let cookiePassword: string = CookieUtils.getCookie('user.pwd');
    if (cookieUserId && cookiePassword) {
      this.userId = cookieUserId;
      this.password = cookiePassword;
      this.login();
    } else {
      this.showInitializing = true;
      this.databaseService.getUsers().subscribe((users: string[]) => {
        this.users = users;
        this.showInitializing = false;
      });
    }
  }

  checkUser(event: any) {
    let enteredUser: string = event.target.value;
    if (enteredUser && enteredUser.trim().length > 0) {
      if (this.users.includes(enteredUser.trim())) {
        this.existingUser = "TRUE";
      } else {
        this.existingUser = "FALSE";
      }
    }
  }

  login() {
    this.showInitializing = true;
    this.databaseService.doLogin({uid: this.userId, pwd: this.password}).subscribe((response: string) => {
      if (response === "success") {
        this.databaseService.loggedInUser = this.userId;
        this.showLoggingIn = true;
        if (this.rememberMe) {
          // write cookie so they won't have to login next time
          console.log("Writing out cookies for automatic login");
          CookieUtils.setCookie('user.id', this.userId, 999);
          CookieUtils.setCookie('user.pwd', this.password, 999);
        }
        this.route.navigate(['main']);
      } else {
        this.showInitializing = false;
        if (response === "badlogin") {
          this.errorMessage = "Credentials are not correct - please try again...";
        } else {
          // does response start with "error|"?  If so, message should be following
          if (response.startsWith("error|")) {
            this.errorMessage = response.split("|")[1];
          } else {
            this.errorMessage = "There was a technical error while logging in";
          }
        }
      }
    });
  }
}
