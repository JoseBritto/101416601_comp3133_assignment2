import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  standalone: true,
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [CommonModule, NgIf, NgFor, FormsModule, NavbarComponent, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(private gql: GraphqlService, private router: Router) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.gql.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load employees.';
        console.error(err);
      }
    });
  }

  handleSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      (`${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query))
    );
  }

  handleDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this employee? This action cannot be undone.');
    if (confirmed) {
      this.gql.deleteEmployee(id).subscribe({
        next: () => {
          this.fetchEmployees();
        },
        error: () => alert('Failed to delete employee.')
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
