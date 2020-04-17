import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthData} from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private token;
  private tokenTimer : any;
  private userId : string;
  private authStatusListener = new Subject<boolean>();

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
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
    this.http.post(BACKEND_URL + '/signup', authData)
    .subscribe((response) => {
      console.log(response);
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    })

  }

  login(email : string, password : string) {
    const authData : AuthData = {
      email : email,
      password : password
    };
    this.http.post<{message : string, token : string, expiresIn : number, userId: string}>(
     BACKEND_URL + '/login', authData)
    .subscribe((response) => {
      this.token = response.token;
      if (this.token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.userId = response.userId;
        this.saveAuthData(this.token,
          new Date(new Date().getTime() + expiresInDuration*1000), this.userId);
        this.router.navigate(['/']);

      }
    }, error => {
      this.authStatusListener.next(false);
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
      this.userId = authInfo.userId;
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
    this.userId = null;
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate),
      userId : userId
    };
  }

  private saveAuthData(token: string, expirationDate : Date, userId : string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }
}
