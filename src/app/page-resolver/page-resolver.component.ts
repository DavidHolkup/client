import {Component, Input, OnInit} from '@angular/core';
import {Information} from "../stream-manager.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-page-resolver',
  templateUrl: './page-resolver.component.html',
  styleUrls: ['./page-resolver.component.scss']
})
export class PageResolverComponent {

  qrCodeData: string = '';
  showConnect = false;
  showDisConnect = false;
  showLoading = true;
  receiverPubKey: string | undefined;
  connectionInfo: Information | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(it => {
      console.log(it)
      this.qrCodeData = it['data']
      this.onDataLoaded()
    })

  }

  onDataLoaded(): void {
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
