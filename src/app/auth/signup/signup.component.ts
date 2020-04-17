import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  templateUrl : './signup.component.html',
  styleUrls : ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy{
  isLoading = false;
  authSub : Subscription;
  onSignup(form : NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  constructor(public authService : AuthService) {}
}
