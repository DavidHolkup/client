import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import {SolWalletsModule} from "angular-sol-wallets";
import { DisconnectComponent } from './disconnect/disconnect.component';
import { PageResolverComponent } from './page-resolver/page-resolver.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    DisconnectComponent,
    PageResolverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SolWalletsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
