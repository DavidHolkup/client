import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletConnectorComponent } from './wallet-connector.component';

describe('WalletConnectorComponent', () => {
  let component: WalletConnectorComponent;
  let fixture: ComponentFixture<WalletConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
