import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import { DisconnectComponent } from './disconnect/disconnect.component';
import { PageResolverComponent } from './page-resolver/page-resolver.component';
import { WalletConnectorComponent } from './wallet-connector/wallet-connector.component';
import { ScannerComponent } from './scanner/scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    DisconnectComponent,
    PageResolverComponent,
    WalletConnectorComponent,
    ScannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
