import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdvertService, AlertService } from '../_services';
import { DisplayAdvert } from '../_models';

@Component({
  selector: 'app-advert-hide',
  templateUrl: './advert-hide.component.html',
  styleUrls: ['./advert-hide.component.css']
})
export class AdvertHideComponent implements OnInit {
  pageTitle: string ='Advert To Hide';
  private sub: Subscription;
  errorMessage: string = '';
  myAdvert: DisplayAdvert;
  loading:boolean = false;

  constructor(private route: ActivatedRoute,
    private advertService: AdvertService, 
    private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getAd(id);
      }
    );
  }

  getAd(id: number): void {
    this.advertService.getAd(id).subscribe({
      next: ad => {
        this.myAdvert = ad;
      },
      error: err => this.errorMessage = err
    });
  }

  HideOrUnhideAdvert(id: number): void{
    this.loading = true;
    console.log(id);
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
          console.log(ads);

          if(ads.advertStatus == "LIVE"){
            this.alertService.success('Your advert is live again.', 
            { keepAfterRouteChange: true });
          }
          else{
            this.alertService.success('Your advert is now hidden.',
            { keepAfterRouteChange: true });
          }
          this.router.navigate(['/my-adverts']);
        }
      })
          },
          error: err => {
            this.errorMessage = err;
            this.loading = true;
          }
    });


  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  

}
