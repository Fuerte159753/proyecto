import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PediAnterPage } from './pedi-anter.page';

describe('PediAnterPage', () => {
  let component: PediAnterPage;
  let fixture: ComponentFixture<PediAnterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PediAnterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
