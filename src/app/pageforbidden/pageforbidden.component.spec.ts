import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageforbiddenComponent } from './pageforbidden.component';

describe('PageforbiddenComponent', () => {
  let component: PageforbiddenComponent;
  let fixture: ComponentFixture<PageforbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageforbiddenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageforbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
