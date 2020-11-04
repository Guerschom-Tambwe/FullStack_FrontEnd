import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { User } from '@app/_models';

@Component(
    { 
        templateUrl: 'login.component.html',
        styleUrls: ['./login.component.css'] 
    })

export class LoginComponent implements OnInit {
    currentUser: User;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    emailValidationErrorMessage: string;
    passwordValidationErrorMessage: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService) 
        { 
            this.accountService.currentUser.subscribe(x => this.currentUser = x);
        /*if (this.accountService.currentUserValue) { 
            this.router.navigate(['/home']);
        }*/

    }

    ngOnInit() {
        if(this.currentUser){
            this.router.navigate(['/my-adverts']);
        }

        this.loginForm = this.formBuilder.group({
            email: ['', Validators.email],
            password: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/my-adverts';

        const emailInputControl = this.loginForm.get('email');
        emailInputControl.valueChanges.pipe(debounceTime(1000))
        .subscribe( value => this.setEmailErrorMessage(emailInputControl));

        const passwordInputControl = this.loginForm.get('password');
        passwordInputControl.valueChanges.pipe(debounceTime(1000))
        .subscribe( value => this.setPasswordErrorMessage(passwordInputControl));
        
        }
        
    setPasswordErrorMessage(c: AbstractControl): void {
        this.passwordValidationErrorMessage = '';
        if((c.touched || c.dirty) && c.errors)
        {
        this.passwordValidationErrorMessage = 'Please enter your password.';
        }
    }


    setEmailErrorMessage(c: AbstractControl): void {
        this.emailValidationErrorMessage = '';
        if((c.touched || c.dirty) && c.errors)
        {
        this.emailValidationErrorMessage = 'Please enter a valid email address';
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
