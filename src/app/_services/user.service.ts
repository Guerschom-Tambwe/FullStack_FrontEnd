import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root' })

export class UserService {
    private usersUrl = `${environment.apiUrl}/users`;
    
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    

    // createUser(user: User): Observable<User> {
    //     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //     user.id = null;
    //     return this.http.post<User>(this.usersUrl, user, { headers })
    //       .pipe(
    //         tap(data => console.log('createUser: ' + JSON.stringify(data))),
    //         catchError(this.handleError)
    //       );
    //   }

    //   private handleError(err): Observable<never> {
    //     let errorMessage: string;
    
    //     if (err.error instanceof ErrorEvent) {
    //       errorMessage = `An error occurred: ${err.error.message}`;
    
    //     } else {
    //       errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    
    //     }
    //     console.error(err);
    //     return throwError(errorMessage);
    //   }
    
    //   private initializeUser(): User {
    //     return {
    //       /*id: 0,
    //       name: null,
    //       surname: null,
    //       email: null,
    //       password: null*/
    //       id: 0,
    //       email: null,
    //       password: null,
    //       firstName: null,
    //       lastName: null,
    //     };
    //   }

}