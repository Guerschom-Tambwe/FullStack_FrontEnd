import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {AdvertService, AlertService, ProvinceService} from '../_services';

import { Advert, Province } from '../_models';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { City } from '@app/_models/city';



@Component({
  templateUrl: './adverts-edit.component.html',
  styleUrls: ['./adverts-edit.component.css']
})


export class AdvertsEditComponent implements OnInit {
  
  pageTitle:string;
  advert: Advert;
  advertsForm:FormGroup;
  errorMessage: string = '';
  loading: boolean;
  provinces: Province[];
  provinceCities:City[];


   //Declaring variables to hold validation messages
   headlineValidationMessage: string;
   advertDetailsValidationMessage: string;
   priceValidationMessage: string;


  //Storing validation messages in separate objects
  private headlineValidationMessages = {
    required: 'Please enter a headline',
    minlength: 'Please enter at least 10 characters',
    maxlength: 'Please enter no more than 100 characters',
    pattern: 'Invalid sentence entered. Avoid excessive use of special characters',
  }

  private advertDetailsValidationMessages = {
    required: 'Please enter a advertDetails',
    pattern: 'Invalid sentence entered. Avoid excessive use of special characters',
    min: 'Please enter at a minimum value of of 100000',
    max: 'Please do not surpass the maximum value of 100000000'
  }


  private priceValidationMessages = {
    required: 'Please enter your price.',
    min: 'Please enter at least 10000 characters',
    max: 'Please enter no more than 100000000 characters'
  }

  private sub: Subscription;

  constructor(private router: Router, 
              private adService: AdvertService, 
              private fb: FormBuilder, 
              private route: ActivatedRoute,
              private alertService: AlertService,
              private provinceService: ProvinceService) { }


  ngOnInit(): void {
    //Defining form group 
    this.advertsForm = this.fb.group({
      headline: 
      ['', [Validators.required, 
            Validators.minLength(10), 
            Validators.maxLength(100), 
            Validators.pattern("^[a-zA-Z0-9,'-](?!.*  )[a-zA-Z0-9,.' ]*[a-zA-Z0-9,.']$")]],
      advertDetails: ['', [Validators.required, Validators.minLength(10), 
            Validators.maxLength(1000), 
            Validators.pattern("^[a-zA-Z0-9,'-](?!.*  )[a-zA-Z0-9,.' ]*[a-zA-Z0-9,.']$")]],
      province: ['', 
            Validators.required],
      city: ['', [
            Validators.required]],
      price: ['', [
            Validators.required, 
            Validators.min(10000), 
            Validators.max(100000000)]]
    });

    this.getProvinces();

    
     // Reading the user Id from the route parameter
     this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getAd(id);
      }
    );
  }
  
  // convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } { return this.advertsForm.controls; }

  getAd(id: number): void {
    this.adService.getAd(id)
      .subscribe({
        next: (advert: Advert) => this.displayAdvert(advert),
        error: err => this.errorMessage = err
      });
  }


  displayAdvert(advert: Advert): void {
    if (this.advertsForm) {
      this.advertsForm.reset();
    }
    this.advert = advert;

    if (this.advert.advertId === 0) {
      this.pageTitle = 'Create an Advert';
    } else {
      this.pageTitle = `Edit Listing: ${this.advert.headline}`;
    }


     // Updating the data on the form
     this.advertsForm.patchValue({
      header: this.advert.headline,
      province: this.advert.province,
      city: this.advert.city,
      advertDetails: this.advert.advertDetails,
      price: this.advert.price
    });


     //Observing changes to form controls one-by-one
     const headerControl = this.advertsForm.get('headline');
     headerControl.valueChanges.pipe(
       debounceTime(1000)
     ).subscribe(
       value => this.setHeadlineValidationMessage(headerControl)
     );
 
     const advertDetailsControl = this.advertsForm.get('advertDetails');
     advertDetailsControl.valueChanges.pipe(
       debounceTime(1000)
     ).subscribe(
       value => this.setadvertDetailsValidationMessage(advertDetailsControl)
     );
 
     const priceControl = this.advertsForm.get('price');
     priceControl.valueChanges.pipe(
       debounceTime(1000)
     ).subscribe(
       value => this.setPriceValidationMessage(priceControl)
     );

     const provinceControl = this.advertsForm.get('province');
     provinceControl.valueChanges.pipe(
       debounceTime(1000)
     ).subscribe(
       value => {
         let provinces:Province[] = this.provinces.filter(x => x.provinceName == value);
         this.provinceCities = provinces[0].cities;
        }
     );
}

getProvinces(){
  this.provinceService.getProvinces().subscribe({
    next: provinces => {
      this.provinces = provinces;
    },  
    error: err => this.errorMessage = err
  });
}





//Setting and displaying validation messages while observing form input
setHeadlineValidationMessage(c: AbstractControl):void {
  this.headlineValidationMessage = '';
  if((c.touched || c.dirty) && c.errors){
    this.headlineValidationMessage = Object.keys(c.errors).map(
      key => this.headlineValidationMessages[key]).join(' ');
  }

}

setadvertDetailsValidationMessage(c: AbstractControl):void {
  this.advertDetailsValidationMessage = '';
  if((c.touched || c.dirty) && c.errors){
    this.advertDetailsValidationMessage = Object.keys(c.errors).map(
      key => this.advertDetailsValidationMessages[key]).join(' ');
  }

}

setPriceValidationMessage(c: AbstractControl):void {
  this.priceValidationMessage = '';
  if((c.touched || c.dirty) && c.errors){
    this.priceValidationMessage = Object.keys(c.errors).map(
      key => this.priceValidationMessages[key]).join(' ');
  }
}

saveAd(): void {
  // reset alerts on submit
  this.alertService.clear();

   // stop here if form is invalid
   if (this.advertsForm.invalid) {
    return;
}

  this.loading = true;

  if (this.advertsForm.valid) {
    if (this.advertsForm.dirty) {
      const a = { ...this.advert, ...this.advertsForm.value }
      
      if (a.advertId === 0) {
        this.adService.createAd(a)
          .subscribe({
            next: () => 
              this.onSaveComplete(),
            error: err => {
              this.errorMessage = err;
              this.loading = false;
            }
          });
      } else {
        this.adService.updateAd(a)
          .subscribe({
            next: () => {
              this.onSaveComplete();
            },
            error: err => {
              this.errorMessage = err;
              this.loading = false;
            }
          });
      }
    } else {
      this.onSaveComplete();
    }
  } else {
    this.errorMessage = 'Please correct the validation errors.';
  }
}

onSaveComplete(): void {
  this.advertsForm.reset();
  this.router.navigate(['/my-adverts']);
}

ngOnDestroy(): void {
  this.sub.unsubscribe();
}

}
