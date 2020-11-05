import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '@app/_helpers/must-match-validator';
import { AccountService, AlertService } from '@app/_services';
import { debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  forenamesValidationMessage: string;
  emailValidationMessage: string;
  surnameValidationMessage: string;
  passwordValidationMessage: string;
  confirmPasswordValidationMessage: string;


  private forenamesValidationMessages = {
    required: 'Please enter your forename(s)',
    pattern: 'Only letters, and SINGLE spaces BETWEEN your forenames, are accepted',
    minlength: 'Please enter at least 1 character',
    maxlength: 'Please enter no more than 100 characters'
  }

  private surnameValidationMessages = {
    required: 'Please enter your surname',
    pattern: 'Unacceptable surname. Please enter letters only',
    minlength: 'Please enter at least 3 characters',
    maxlength: 'Please enter no more than 100 characters'
  }

  private emailValidationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid Email address.',
    minlength: 'Please enter at least 6 characters',
    maxlength: 'Please enter no more than 100 characters'
  }

  private passwordValidationMessages = {
    required: 'Please enter your password',
    minlength: 'The Password must be longer than 8 characters.',
    maxlength: 'Please enter no more than 100 characters'
  }

  private confirmPasswordValidationMessages = {
    required: 'Please re-enter your password',
    mustMatch: 'Passwords must match'
  }


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
    forenames: ['', [Validators.required, Validators.minLength(1), 
                     Validators.maxLength(100), 
                     Validators.pattern("^[a-zA-Z](?!.*  )[a-zA-Z ]*[a-zA-Z]$")]],
    surname: ['', [Validators.required, Validators.minLength(3), 
                    Validators.maxLength(100), Validators.pattern("^[A-Za-z-{1}]+[A-Za-z]$")]],
    email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), 
                 Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    confirmPassword: ['', Validators.required]
  },
  {
    validator: MustMatch('password', 'confirmPassword')
}
  );

//Observing changes to form controls one-by-one
const forenamesControl = this.registrationForm.get('forenames');
forenamesControl.valueChanges.pipe(
  debounceTime(1500)
).subscribe(
  value => this.setForenamesValidationMessage(forenamesControl)
);

const surnameControl = this.registrationForm.get('surname');
surnameControl.valueChanges.pipe(
  debounceTime(1000)
).subscribe(
  value => this.setSurnameValidationMessage(surnameControl)
);

const emailControl = this.registrationForm.get('email');
emailControl.valueChanges.pipe(
  debounceTime(1000)
).subscribe(
  value => this.setEmailValidationMessage(emailControl)
);

const passwordControl = this.registrationForm.get('password');
passwordControl.valueChanges.pipe(
  debounceTime(1000)
).subscribe(
  value => this.setPasswordValidationMessage(passwordControl)
);

const confirmPasswordControl = this.registrationForm.get('confirmPassword');
confirmPasswordControl.valueChanges.pipe(
  debounceTime(1000)
).subscribe(
  value => this.setConfirmPasswordValidationMessage(confirmPasswordControl)
);
  }


//
  setForenamesValidationMessage(c: AbstractControl):void {
    this.forenamesValidationMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.forenamesValidationMessage = Object.keys(c.errors).map(
        key => this.forenamesValidationMessages[key]).join(' ');
        console.log(this.forenamesValidationMessage)
    }

  }

  setEmailValidationMessage(c: AbstractControl): void {
    this.emailValidationMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.emailValidationMessage = Object.keys(c.errors).map(
        key => this.emailValidationMessages[key]).join(' ');
    }
  }

  setSurnameValidationMessage(c: AbstractControl): void {
    this.surnameValidationMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.surnameValidationMessage = Object.keys(c.errors).map(
        key => this.surnameValidationMessages[key]).join(' ');
    }
  }

  setPasswordValidationMessage(c: AbstractControl): void {
    this.passwordValidationMessage = '';
    if((c.touched || c.dirty) && c.errors){
      this.passwordValidationMessage = Object.keys(c.errors).map(
        key => this.passwordValidationMessages[key]).join(' ');
        console.log(this.passwordValidationMessage)
    }
  }

  
   // convenience getter for easy access to form fields
   get f() { return this.registrationForm.controls; }

   setConfirmPasswordValidationMessage(c: AbstractControl): void {
    var confirmPasswordControl = this.f.confirmPassword;
    this.confirmPasswordValidationMessage = '';
    if((c.touched || c.dirty) && (c.errors || confirmPasswordControl.errors)){
      this.confirmPasswordValidationMessage = Object.keys(confirmPasswordControl.errors).map(
        key => this.confirmPasswordValidationMessages[key]).join(' ');
    }
  }

   onSubmit() {
       this.submitted = true;

       // reset alerts on submit
       this.alertService.clear();

       // stop here if form is invalid
       if (this.registrationForm.invalid) {
           return;
       }

       this.loading = true;
       this.accountService.register(this.registrationForm.value)
           .pipe(first())
           .subscribe({
               next: () => {
                   this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                   this.router.navigate(['../login'], { relativeTo: this.route });
               },
               error: error => {
                   this.alertService.error(error);
                   this.loading = false;
               }
           });
   }

}
