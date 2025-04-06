import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {MatCard} from '@angular/material/card';


@Component({
  standalone: true,
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule, MatCard
  ],
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gql: GraphqlService,
    protected router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      employee_photo: [''] // Optional for now
    });
  }

  photoPreview: string | null = null;



  updatePreview() {
    const url = this.employeeForm.get('employee_photo')?.value;
    const fname = this.employeeForm.get('first_name')?.value;
    const lname = this.employeeForm.get('last_name')?.value;
    if(fname && lname && lname.length > 0 && fname.length > 0) {
      this.photoPreview = url && url.trim() !== '' ? url : 'https://ui-avatars.com/api/?name=' + fname + '+' + lname;
    } else {
      this.photoPreview = url && url.trim() !== '' ? url : null;
    }
  }




  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    const input = this.employeeForm.value;
    this.gql.addEmployee(input).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add employee.');
      }
    });
  }
}
