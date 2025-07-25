import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BienvenidaModalComponent } from './bienvenida-modal.component';

describe('BienvenidaModalComponent', () => {
  let component: BienvenidaModalComponent;
  let fixture: ComponentFixture<BienvenidaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BienvenidaModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BienvenidaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
