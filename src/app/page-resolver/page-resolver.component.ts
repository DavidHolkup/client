import {Component, Input, OnInit} from '@angular/core';
import {Information} from "../stream-manager.service";

@Component({
  selector: 'app-page-resolver',
  templateUrl: './page-resolver.component.html',
  styleUrls: ['./page-resolver.component.scss']
})
export class PageResolverComponent implements OnInit {

  @Input() qrCodeData: string = ''
  showConnect = false;
  showDisConnect = false;
  showLoading = true;
  receiverPubKey: string | undefined = 'Nh1HjkKsb3q75paquwoSXVxCWZ9fJdqguRDND1QYvc4'; // TODO;
  connectionInfo: Information | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.qrCodeData.startsWith('stop:')) {
      this.receiverPubKey = this.qrCodeData.split(':')[1]
      this.showLoading = false
      this.showDisConnect = true
    } else {
      this.connectionInfo = JSON.parse(this.qrCodeData)
      this.showLoading = false
      this.showConnect = true
    }
  }

}
