import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WalletConnectorComponent} from "./wallet-connector/wallet-connector.component";
import {ScannerComponent} from "./scanner/scanner.component";
import {PageResolverComponent} from "./page-resolver/page-resolver.component";

const routes: Routes = [
  {path: 'login', component: WalletConnectorComponent},
  {path: 'scan', component: ScannerComponent},
  {path: 'app/:data', component: PageResolverComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
