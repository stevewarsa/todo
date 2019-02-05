import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeletedItemsComponent } from './deleted-items/deleted-items.component';
import { ViewEditTodoComponent } from './view-edit-todo/view-edit-todo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoTableComponent } from './todo-table/todo-table.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'view', component: ViewEditTodoComponent},
  {path: 'deletedItems', component: DeletedItemsComponent},
  {path: 'changePassword', component: ChangePasswordComponent},
  {path: 'main', component: TodoTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
