/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SanitizePipe } from './sanitize.pipe';
import { DomSanitizer } from '@angular/platform-browser';
describe('Pipe: Sanitizee', () => {
  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SanitizePipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});

