import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeMeComponent } from './resize-me.component';

describe('ResizeMeComponent', () => {
  let component: ResizeMeComponent;
  let fixture: ComponentFixture<ResizeMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
