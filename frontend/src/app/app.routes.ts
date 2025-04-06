import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { authGuard } from './services/auth.guard';
import { EmployeeListComponent } from './views/employee-list/employee-list.component';
import {EmployeeAddComponent} from './views/employee-add/employee-add.component';
import {EmployeeEditComponent} from './views/employee-edit/employee-edit.component';
import {EmployeeDetailComponent} from './views/employee-detail/employee-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'employees',
    canActivate: [authGuard],
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'add', component: EmployeeAddComponent },
      { path: 'edit/:id', component: EmployeeEditComponent },
      { path: 'details/:id', component: EmployeeDetailComponent },
    ]
  }
];
