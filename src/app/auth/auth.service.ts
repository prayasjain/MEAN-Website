import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthData} from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private token;
  private tokenTimer : NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  constructor(private http : HttpClient, private router : Router) {}

  createUser(email : string, password : string) {
    const authData : AuthData = {
      email : email,
      password : password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe((response) => {
      console.log(response);
    })
  }

  login(email : string, password : string) {
    const authData : AuthData = {
      email : email,
      password : password
    };
    this.http.post<{message : string, token : string, expiresIn : number}>(
      'http://localhost:3000/api/user/login', authData)
    .subscribe((response) => {
      this.token = response.token;
      if (this.token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(this.token,
          new Date(new Date().getTime() + expiresInDuration*1000));
        this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(expiresInDuration : number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()}, expiresInDuration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate)
    };
  }

  private saveAuthData(token: string, expirationDate : Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
