import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdvertService, AlertService } from '../_services';
import { DisplayAdvert } from '../_models';


@Component({
  templateUrl: './advert-delete.component.html',
  styleUrls: ['./advert-delete.component.css']
})
export class AdvertDeleteComponent implements OnInit {

  pageTitle: string ='Advert To Delete';
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

  deleteAdvert(id: number): void{
    this.loading = true;
    this.advertService.getAd(id).subscribe({
      next: ads => {
        ads.advertStatus = "DELETED";
      
      this.advertService.updateAd(ads).subscribe({
        next: (ads) => {
          this.alertService.success('Your advert is successfully deleted.', 
          { keepAfterRouteChange: true });
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
