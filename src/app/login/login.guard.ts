import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService
) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const currentUser = this.accountService.currentUserValue;
  if (currentUser) {
      this.router.navigate(['/my-adverts'], { queryParams: { returnUrl: state.url }});
      return false;
  }

  return true;
}
  
}
