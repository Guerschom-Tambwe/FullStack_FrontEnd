import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { RegisterUser, User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string):Observable<User> {
       return this.http.post<User>(`${environment.apiUrl}/api/users/authenticate`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout():void {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/home']);
    }

    register(user: RegisterUser) :Observable<RegisterUser>{
        return this.http.post<RegisterUser>(`${environment.apiUrl}/api/users/newuser/register`, user);
    }

    getAll(): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/users`);
    }

    getById(id: string):Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id:number, params: object): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.currentUserValue.id) {
                    // update local storage
                    const user = { ...this.currentUserValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.currentUserSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string): Observable<User> {
        return this.http.delete<User>(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.currentUserValue.id.toString()) {
                    this.logout();
                }
                return x;
            }));
    }
}