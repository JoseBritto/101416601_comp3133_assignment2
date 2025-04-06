import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GraphqlService} from '../../services/graphql.service';
import {NavbarComponent} from '../../navbar/navbar.component';
import {MatCard} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule, MatCard
  ],
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  employeeId: string = '';

  constructor(
    private route: ActivatedRoute,
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
      employee_photo: ['']
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

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.gql.getAllEmployees().subscribe({
      next: (data) => {
        let employee = data.find((x: any) => x.id == this.employeeId);
        this.employeeForm.patchValue(employee);
        this.updatePreview();
        if(employee && employee.date_of_joining && employee.date_of_joining != 0) {
          let doj = new Date(employee.date_of_joining * +1);
          let date_of_joining = doj.toISOString().substring(0, 10);
          console.log(date_of_joining);
          this.employeeForm.patchValue({date_of_joining: date_of_joining});
        }
      },
      error: (err) => {
        console.error('Failed to load employee', err);
        alert('Failed to load employee data');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    this.gql.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Update failed');
      }
    });
  }
}
