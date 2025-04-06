import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.watchQuery({
      query: gql`
        query {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            department
            date_of_joining
            employee_photo
          }
        }
      `
    }).valueChanges.pipe(
      map((result: any) => result.data.getAllEmployees)
    );
  }

  addEmployee(employee: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee($input: EmployeeInput!) {
          addEmployee(input: $input) {
            id
            first_name
            last_name
          }
        }
      `,
      variables: { input: employee }
    });
  }

  getEmployeeById(id: string) {
    return this.apollo.watchQuery({
      query: gql`
        query GetEmployeeById($id: ID!) {
          searchEmployeeByEid(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            salary
            department
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { id }
    }).valueChanges.pipe(map((res: any) => res.data.getEmployeeById));
  }

  updateEmployee(id: string, input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
          updateEmployeeByEid(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: { id, input }
    });
  }


  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployeeByEid(id: $id)
        }
      `,
      variables: { id }
    });
  }

}
