import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Province } from '../_models';
import { environment } from '@environments/environment';
import { City } from '@app/_models/city';


@Injectable({
  providedIn: 'root'
})

export class ProvinceService {
  private provincesUrl = `${environment.apiUrl}/api/provinces`;

  constructor(private http: HttpClient) { }


getProvinces(): Observable<Province[]>{
  return this.http.get<Province[]>(this.provincesUrl).pipe(
      //tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
      );
}

  getProvince(id: number): Observable<Province> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.provincesUrl}/${id}`;
    return this.http.get<Province>(url)
      .pipe(
        //tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getCityByProvince(provinceName: string): Observable<Province> {
    const url = `${this.provincesUrl}/${provinceName}/cities`;
    return this.http.get<Province>(url)
      .pipe(
        tap(data => data),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeUser(): Province {
    return {
      provinceId: 0,
      provinceName: null,
      cities: []
    };
  }

}
