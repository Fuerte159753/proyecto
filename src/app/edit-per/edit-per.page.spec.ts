import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPerPage } from './edit-per.page';

describe('EditPerPage', () => {
  let component: EditPerPage;
  let fixture: ComponentFixture<EditPerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditPerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
