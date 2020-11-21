import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Advert, DisplayAdvert, User } from '@app/_models';
import { AdvertService, AccountService } from '../_services';

@Component({
  selector: 'app-homes-for-sale',
  templateUrl: './homes-for-sale.component.html',
  styleUrls: ['./homes-for-sale.component.less']
})
export class HomesForSaleComponent implements OnInit {
  errorMessage:string = '';
  adverts: DisplayAdvert[];
  currentUser: User;
  pageTitle: string = 'My Adverts';

  constructor(private advertService: AdvertService, private accountService:AccountService, private router: Router) { 
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.advertService.getAds().subscribe({
      next: adverts => {
        this.adverts = adverts;
      },
      error: err => this.errorMessage = err
    });
  }

}
