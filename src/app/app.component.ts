import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {MarketStreamService} from "./features/services/market-stream.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Cryptocurrency} from "./core/enums/cryptocurrency.enum";
import {LoaderComponent} from "./shared/loader/loader.component";
import {ExchangeService} from "./features/services/exchange.service";
import {interval, startWith, switchMap} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsyncPipe, NgIf, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  protected lightMode: boolean = false;

  constructor(
    private marketStreamService: MarketStreamService,
    private exchangeService: ExchangeService
  ) { }

  ngOnInit() {
    this.subscribeToMarketStreamsTrade([
      Cryptocurrency.BTC,
      Cryptocurrency.ETH,
      Cryptocurrency.DOGE
    ]);

    this.getExchanges();
  }

  private subscribeToMarketStreamsTrade(symbols: string[]) {
    this.marketStreamService.subscribeToMarketStreamsTrade(symbols).subscribe();
  }

  private getExchanges() {
    this.exchangeService.getExchanges()
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.exchangeService.getExchanges()),
      )
      .subscribe();
  }
}
