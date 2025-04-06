import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule, formatCurrency} from '@angular/common';
import {GraphqlService} from '../../services/graphql.service';
import {NavbarComponent} from '../../navbar/navbar.component';
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  imports: [CommonModule, NavbarComponent, MatCardModule, MatButton],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = null;
  error: string = '';
  loading: boolean = true;
  date_of_joining: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gql: GraphqlService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.gql.getAllEmployees().subscribe({
      next: (data) => {
        this.employee = data.find((x: any) => x.id == id);
        this.loading = false;
        if(this.employee && this.employee.date_of_joining && this.employee.date_of_joining != 0) {
          let doj = new Date(this.employee.date_of_joining * +1);
          this.date_of_joining= doj.toISOString().substring(0, 10);
        }
      },
      error: () => {
        this.error = 'Failed to load employee details';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  goBack() {
    this.router.navigate(['/employees']);
  }

  protected readonly formatCurrency = formatCurrency;
}
