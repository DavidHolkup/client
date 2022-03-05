import {Component, Input, OnInit} from '@angular/core';
import {Information, StreamManagerService} from "../stream-manager.service";

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  @Input() info!: Information;

  constructor(){}

  openPaymentChannel() {
    StreamManagerService.create(this.info);
  }

  ngOnInit(): void {
  }

}
