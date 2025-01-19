import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyUsBoxComponent } from './why-us-box.component';

describe('WhyUsBoxComponent', () => {
  let component: WhyUsBoxComponent;
  let fixture: ComponentFixture<WhyUsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyUsBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyUsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
