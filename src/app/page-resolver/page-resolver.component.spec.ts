import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageResolverComponent } from './page-resolver.component';

describe('PageResolverComponent', () => {
  let component: PageResolverComponent;
  let fixture: ComponentFixture<PageResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageResolverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
