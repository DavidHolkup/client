import {Component, Input, OnInit} from '@angular/core';
import {PublicKey} from "@solana/web3.js";
import {StreamManagerService} from "../stream-manager.service";
import {Stream as StreamData} from "@streamflow/stream/dist/types";

@Component({
  selector: 'app-disconnect',
  templateUrl: './disconnect.component.html',
  styleUrls: ['./disconnect.component.scss']
})
export class DisconnectComponent implements OnInit {

  @Input() receiver!: string
  private streamInformation: any;
  private streamId: string | undefined;
  private showError: boolean = false;
  private showLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.findConnection().then(() => {
      this.showLoading = false;
    })
  }

  async findConnection() {
    const stream = await StreamManagerService.getActiveStream(this.receiver)
    if (stream == undefined) {
      this.showError = true;
      return
    }
    this.streamId = stream.id;
    this.streamInformation = stream.data;
  }

  closeConnection() {
    StreamManagerService.cancelStream(this.streamId!)
  }

}
