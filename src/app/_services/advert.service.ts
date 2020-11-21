import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Advert, DisplayAdvert, User } from '../_models';
import { environment } from '@environments/environment';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})

export class AdvertService {
  private adsUrl = `${environment.apiUrl}/api/adverts`;
  currentUser: User;
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
   }


getAds(): Observable<DisplayAdvert[]>{
  return this.http.get<DisplayAdvert[]>(this.adsUrl).pipe(
      //tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
      );
}

getAdsByUserId(id: number): Observable<DisplayAdvert[]>{
  return this.http.get<DisplayAdvert[]>(`${this.adsUrl}/currentuser/${id}`).pipe(
      //tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
      );
}

  getAd(id: number): Observable<DisplayAdvert> {
    if (id === 0) {
      return of(this.initializeDisplayAdvert());
    }
    const url = `${this.adsUrl}/${id}`;
    return this.http.get<DisplayAdvert>(url)
      .pipe(
        //tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createAd(advert: Advert): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //advert.advertId = null;
    return this.http.post<Advert>(this.adsUrl, advert, { headers })
      .pipe(
        //tap(data => console.log('createAd: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteAd(id: number): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.adsUrl}/${id}`;
    return this.http.delete<Advert>(url, { headers })
      .pipe(
        //tap(data => console.log('deleteProduct: ' + id)),
        catchError(this.handleError)
      );
  }

  updateAd(advert: DisplayAdvert): Observable<DisplayAdvert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.adsUrl}/${advert.advertId}`;
    return this.http.put<DisplayAdvert>(url, advert, { headers })
      .pipe(
        //tap(() => console.log('updateUser: ' + advert.advertId)),
        map(() => advert),
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

  private initializeDisplayAdvert(): DisplayAdvert {
    return {
      advertId: 0,
      headline: null,
      advertDetails: null,
      province: null,
      city: null,
      price: null,
      userId: this.currentUser.id,
      advertStatus: "LIVE",
      publishedDate: new Date()
    };
  }

}
