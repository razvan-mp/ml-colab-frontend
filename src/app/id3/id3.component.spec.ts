import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Id3Component } from './id3.component';

describe('Id3Component', () => {
  let component: Id3Component;
  let fixture: ComponentFixture<Id3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Id3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Id3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
