import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector : 'app-header',
  templateUrl : './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  private authListenerSub : Subscription;
  userIsAuthenticated = false;

  constructor(private authService : AuthService) {}

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    console.log(this.userIsAuthenticated);
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
