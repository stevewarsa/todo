import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TodoTableComponent } from './todo-table/todo-table.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewEditTodoComponent } from './view-edit-todo/view-edit-todo.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { DeletedItemsComponent } from './deleted-items/deleted-items.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [
    AppComponent,
    TodoTableComponent,
    LoginComponent,
    ViewEditTodoComponent,
    ConfirmComponent,
    TopNavComponent,
    DeletedItemsComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmComponent
  ]
})
export class AppModule { }
