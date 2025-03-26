import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  baseURL = "http://localhost:5147/api/";

  private loginStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatus$ = this.loginStatusSubject.asObservable();

  createUser(formData: any){
    return this.http.post(this.baseURL+'signup',formData);
  }

  signin(formData: any){
    var result = this.http.post(this.baseURL+'signin',formData);
    return result;
  }

  isLoggedIn(): boolean {
      return !!localStorage.getItem('token');
  }

  onLogout(){
    localStorage.removeItem('token');
    this.loginStatusSubject.next(false);
    //this.messageService.add({ severity: 'success', summary: 'Logout successful!', detail: '', life: 3000 });
  }

  setSubject(){
    this.loginStatusSubject.next(true);
  }
}
