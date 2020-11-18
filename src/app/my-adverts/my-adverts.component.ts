import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Advert, User } from '@app/_models';
import { AdvertService, AccountService } from '../_services';

@Component({
  selector: 'app-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.css']
})
export class MyAdvertsComponent implements OnInit {
  errorMessage:string = '';
  myAdverts: Advert[];
  currentUser: User;
  pageTitle: string = 'My Adverts';
  dropdownActions: boolean = false;
  deleteId: number;

  constructor(private advertService: AdvertService, private accountService:AccountService, private router: Router) { 
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.advertService.getAds().subscribe({
      next: ads => {
        this.myAdverts = ads.filter(x => (x.userId == this.currentUser.id) && (x.advertStatus !== "DELETED"));
      },
      error: err => this.errorMessage = err
    });
  }

  deleteAdvert(id: number): void{
    this.advertService.getAd(id).subscribe({
      next: ads => {
        ads.advertStatus = "HIDDEN";
        
      this.advertService.updateAd(ads).subscribe({
        next: (ads) => {
          this.router.navigate(['/home']);
        }
      })
          },
          error: err => {
            this.errorMessage = err;
          }
    });


  }

}
