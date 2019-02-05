import { DatabaseService } from './../database.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'td-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
  currentUser: string;
  oldPassword: string = null;
  newPassword: string = null;
  newPasswordR: string = null;
  mobile: boolean = false;
  initializing: boolean = false;
  initializingMessage: string = null;
  errorMessage: string = null;
  @ViewChild('oldPasswordInput') oldPasswordInput: ElementRef;

  constructor(private databaseService: DatabaseService, private route: Router) { }

  ngOnInit() {
    this.currentUser = this.databaseService.loggedInUser;
    if (!this.currentUser) {
      // user not logged in, so re-route to login
      this.route.navigate(['']);
      return;
    }
    if (window.screen.width < 700) { // 768px portrait
      this.mobile = true;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.oldPasswordInput.nativeElement.focus();
    }, 100);
  }

  onChangePasswordClick() {
    this.initializing = true;
    this.initializingMessage = "Changing password for user " + this.currentUser + " from " + this.oldPassword + " to " + this.newPassword + "...";
    this.databaseService.changePassword({uid: this.currentUser, oldPassword: this.oldPassword, newPassword: this.newPassword}).subscribe((response: string) => {
      console.log(response);
      if (response === "success") {
        this.route.navigate(['main']);
      } else {
        if (response === "badlogin") {
          this.errorMessage = "The old password entered does not match the one stored in the database.";
        } else if (response.startsWith("error|")) {
          this.errorMessage = response.split("|")[1];
        } else {
          // assume this is either "error" or some other unexpected response
          this.errorMessage = "There was an error changing the password - please try again or report this issue...";
        }
      }
      this.initializing = false;
      this.initializingMessage = null;
    });
  }
}
