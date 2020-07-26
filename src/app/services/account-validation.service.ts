import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AccountValidationService {
  constructor(private http: HttpClient) { }

  validateAccount(email: string) {
    return this.http.post('http://prueba-teamknowlogy.nicolasoga.com.ar/send-account-validation-email', { email }).subscribe()
  }
}
