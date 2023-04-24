import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamsModalsComponent } from './user-teams-modals.component';

describe('UserTeamsModalsComponent', () => {
  let component: UserTeamsModalsComponent;
  let fixture: ComponentFixture<UserTeamsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTeamsModalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTeamsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
