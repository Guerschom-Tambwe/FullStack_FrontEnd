import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.less']
})
export class SubMenuComponent implements OnInit {
  currentUser: User;
  constructor(private accountService: AccountService) 
  { 
    this.accountService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
  }

}
