import { Component, OnInit } from '@angular/core';
import {StreamManagerService} from "../stream-manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wallet-connector',
  templateUrl: './wallet-connector.component.html',
  styleUrls: ['./wallet-connector.component.scss']
})
export class WalletConnectorComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  connect() {
    StreamManagerService.connectWallet()
  }

  continue() {
    this.router.navigateByUrl('/scan')
  }
}
