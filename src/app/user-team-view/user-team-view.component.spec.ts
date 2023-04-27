import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamViewComponent } from './user-team-view.component';

describe('UserTeamViewComponent', () => {
  let component: UserTeamViewComponent;
  let fixture: ComponentFixture<UserTeamViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTeamViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTeamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
