import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HclusteringComponent } from './hclustering.component';

describe('HclusteringComponent', () => {
  let component: HclusteringComponent;
  let fixture: ComponentFixture<HclusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HclusteringComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HclusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
