import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
  selector: 'sq-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss']
})
export class EmailInputComponent implements OnInit {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() placeholder = 'Correo Electrónico';

  constructor() {
    this.internalValue = this.value;
  }

  ngOnInit() {}

  private

  internalValue: string;
  focused = false;
  valid = true;

  onValueChange(value) {
    this.internalValue = value;
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.validate();
  }

  hasValue() {
    return this.internalValue && !!this.internalValue.trim();
  }

  clear() {
    this.value = '';
    this.internalValue = '';
    this.valid = true;
    this.valueChange.emit(null);
  }

  validate() {
    if (!this.hasValue()) {
      this.valid = true;
      this.valueChange.emit(null);
      return;
    }

    if (EMAIL_VALIDATION_REGEX.test(this.internalValue)) {
      this.valid = true;
      this.valueChange.emit(this.internalValue);
      return
    }

    this.valid = false;
    this.valueChange.emit(null);

    return false;
  }
}
