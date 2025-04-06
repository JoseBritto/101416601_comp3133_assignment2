import {inject, Injectable} from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {throwError} from 'rxjs';

const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private apollo = inject(Apollo);

  login(email: string, password: string) {
    return this.apollo.watchQuery({
      query: LOGIN_QUERY,
      variables: { email, password }
    }).valueChanges.pipe(
      map((result: any) => {
        let token = result.data.login;
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          return token;
        } else {
          return throwError(() => new Error('Unauthorized'));
        }
      })
    );
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    }).pipe(
      map((result: any) => result.data.signup)
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
