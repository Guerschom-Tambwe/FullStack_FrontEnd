import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Advert, User } from '@app/_models';
import { AdvertService, AccountService, AlertService } from '../_services';

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
  loading: boolean =  false;
  advertId: number;

  constructor(private advertService: AdvertService, private accountService:AccountService, private router: Router, private alertService: AlertService) { 
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.advertService.getAdsByUserId(this.currentUser.id).subscribe({
      next: ads => {
        this.myAdverts = ads;
      },
      error: err => this.errorMessage = err
    });
  }

  deleteAdvert(id: number): void{
    this.loading = true;
    this.advertService.getAd(id).subscribe({
      next: ads => {
        ads.advertStatus = "DELETED";
      
      this.advertService.updateAd(ads).subscribe({
        next: (ads) => {
          this.ngOnInit();
          this.alertService.success('Your advert is successfully deleted.');  
        }
      })
          },
          error: err => {
            this.errorMessage = err;
            this.loading = true;
          }
    });
  }

  HideOrUnhideAdvert(id: number): void{
    this.loading = true;
    this.advertService.getAd(id).subscribe({
      next: ads => {
        if(ads.advertStatus == "LIVE"){
          ads.advertStatus = "HIDDEN";
        }
        else{
          ads.advertStatus = "LIVE";
        }
         
      this.advertService.updateAd(ads).subscribe({
        next: (ads) => {

          if(ads.advertStatus == "LIVE"){
            this.ngOnInit();
            this.alertService.success('Your advert is live again.');
          }
          else{
            this.ngOnInit();
            this.alertService.success('Your advert is now hidden.');
          }
          this.loading = false;
        }
      })
          },
          error: err => {
            this.errorMessage = err;
            this.loading = false;
          }
    });
  }

  

  //Applicable for the delete operation by way of the delete confirmation dialog box
  getAdvertId(id: number){
    this.advertId = id;
  }
 }
