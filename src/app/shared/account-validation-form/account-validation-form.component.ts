import { Component, OnInit } from '@angular/core';
import { AccountValidationService } from '../../services/account-validation.service'

@Component({
  selector: 'sq-account-validation-form',
  templateUrl: './account-validation-form.component.html',
  styleUrls: ['./account-validation-form.component.css']
})
export class AccountValidationFormComponent implements OnInit {
  private email: string;

  constructor(private accountValidationService: AccountValidationService) { }

  ngOnInit() { }

  private

  onSubmit() {
    if (!this.email || !this.email.trim()) { return; }
    this.accountValidationService
      .validateAccount(this.email)
      .subscribe(data => console.log(data))
  }
}
