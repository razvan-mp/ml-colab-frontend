import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFriendsModalsComponent } from './user-friends-modals.component';

describe('UserFriendsModalsComponent', () => {
  let component: UserFriendsModalsComponent;
  let fixture: ComponentFixture<UserFriendsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFriendsModalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFriendsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
