import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotesModalsComponent } from './user-notes-modals.component';

describe('UserNotesModalsComponent', () => {
  let component: UserNotesModalsComponent;
  let fixture: ComponentFixture<UserNotesModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNotesModalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNotesModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
