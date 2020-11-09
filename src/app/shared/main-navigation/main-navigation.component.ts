import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {
  currentUser: User;
  constructor(private router: Router, private accountService: AccountService) { 
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
  }

  
  logout() {
    this.accountService.logout();
    this.router.navigate(['/home']);
}

}
