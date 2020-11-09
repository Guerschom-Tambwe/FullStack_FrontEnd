import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';

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
    //submitted = false;
    returnUrl: string;
    error = '';

    emailValidationErrorMessage: string;
    passwordValidationErrorMessage: string;

    private emailValidationMessages = {
        required: 'Please enter your email address.',
        email: 'Please enter a valid Email address.',
        minlength: 'Please enter at least 6 characters.',
        maxlength: 'Please enter no more than 100 characters.'
      }
    
      private passwordValidationMessages = {
        required: 'Please enter your password.',
        minlength: 'The Password must be longer than 8 characters.',
        maxlength: 'Please enter no more than 100 characters.'
      }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService) 
        { 
            this.accountService.currentUser.subscribe(x => this.currentUser = x);
        if (this.accountService.currentUserValue) { 
            this.router.navigate(['/home']);
        }

    }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), 
                         Validators.email ]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

        const emailInputControl = this.loginForm.get('email');

        emailInputControl.valueChanges.pipe(
            debounceTime(1000))
        .subscribe( value => 
            this.setEmailErrorMessage(emailInputControl));

        const passwordInputControl = this.loginForm.get('password');

        passwordInputControl.valueChanges.pipe(
            debounceTime(1000))
        .subscribe( value => 
            this.setPasswordErrorMessage(passwordInputControl));
        
        }
        
    setPasswordErrorMessage(c: AbstractControl): void 
    {
    this.passwordValidationErrorMessage = '';  

    if((c.touched || c.dirty) && c.errors)
        {
        this.passwordValidationErrorMessage = Object.keys(c.errors).map(
            key => this.passwordValidationMessages[key]).join(' ');
        }
    }


    setEmailErrorMessage(c: AbstractControl): void 
    {
    this.emailValidationErrorMessage = '';
        
    if((c.touched || c.dirty) && c.errors)
        {
        this.emailValidationErrorMessage =Object.keys(c.errors).map(
            key => this.emailValidationMessages[key]).join(' ');
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        //this.submitted = true;

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
