import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSocialsModalsComponent } from './user-socials-modals.component';

describe('UserSocialsModalsComponent', () => {
  let component: UserSocialsModalsComponent;
  let fixture: ComponentFixture<UserSocialsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSocialsModalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSocialsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
