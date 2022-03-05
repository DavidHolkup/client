import {Component, Input, OnInit} from '@angular/core';
import {Information, StreamManagerService} from "../stream-manager.service";

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  @Input() info: Information = {
      adults: 2,
      students: 2,
      children: 1,
      pricePerAdult: 0.05,
      pricePerStudent: 0.04,
      pricePerChild: 0.02,
      priceUnit: 'MINUTE',
      receiver: 'TODO WALLET ADDRESS',
      receiverName: 'Solana Swimming Pool'
    };

  constructor(){}

  openPaymentChannel() {
    StreamManagerService.create(this.info);
  }

  ngOnInit(): void {
  }

}
