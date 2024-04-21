import { Routes } from '@angular/router';
import {MarketComponent} from "./features/market/market.component";
import {BuyTicketsComponent} from "./features/buy-tickets/buy-tickets.component";
import {HomeComponent} from "./features/home/home.component";
import {ErrorPageComponent} from "./pages/error-page/error-page.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'market', component: MarketComponent},
  {path: 'buy-tickets', component: BuyTicketsComponent},
  {path: '**', component: ErrorPageComponent}
];
