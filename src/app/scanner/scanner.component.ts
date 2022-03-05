import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  private qrInfoEnter = JSON.stringify({
    adults: 2,
    students: 2,
    children: 1,
    pricePerAdult: 0.005,
    pricePerStudent: 0.004,
    pricePerChild: 0.002,
    priceUnit: 'MINUTE',
    receiver: 'Nh1HjkKsb3q75paquwoSXVxCWZ9fJdqguRDND1QYvc4',
    receiverName: 'Solana Swimming Pool'
  })

  private qrInfoLeave = 'stop:Nh1HjkKsb3q75paquwoSXVxCWZ9fJdqguRDND1QYvc4'
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  enter() {
    this.router.navigateByUrl('app/' + this.qrInfoEnter)
  }

  leave() {
    this.router.navigateByUrl('app/' + this.qrInfoLeave)
  }
}
