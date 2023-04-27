import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamViewModalsComponent } from './user-team-view-modals.component';

describe('UserTeamViewModalsComponent', () => {
  let component: UserTeamViewModalsComponent;
  let fixture: ComponentFixture<UserTeamViewModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTeamViewModalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTeamViewModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
