import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSearchItemComponent } from './panel-search-item.component';

describe('PanelSearchItemComponent', () => {
  let component: PanelSearchItemComponent;
  let fixture: ComponentFixture<PanelSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
