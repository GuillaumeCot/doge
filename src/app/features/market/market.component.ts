import {Component, OnInit} from '@angular/core';
import {MarketStreamService} from "../services/market-stream.service";
import {filter, map, Observable, tap} from "rxjs";
import {
  AsyncPipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  NgClass,
  NgIf,
  NgOptimizedImage,
  TitleCasePipe,
  UpperCasePipe
} from "@angular/common";
import {TableModule} from "primeng/table";
import {Cryptocurrency} from "../../core/enums/cryptocurrency.enum";
import {LoaderComponent} from "../../shared/loader/loader.component";
import {Exchange} from "../../core/models/exchange.model";
import {ExchangeService} from "../services/exchange.service";
import {RefreshComponent} from "../../components/refresh/refresh.component";

interface CryptoTrade {
  name: Cryptocurrency;
  symbol: string;
  price: number;
  img: string;
}

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    JsonPipe,
    TableModule,
    NgOptimizedImage,
    NgClass,
    LowerCasePipe,
    LoaderComponent,
    TitleCasePipe,
    DecimalPipe,
    RefreshComponent,
    UpperCasePipe
  ],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss'
})
export class MarketComponent implements OnInit {

  protected trades$!: Observable<Map<string, number> | null | undefined>;
  protected exchanges$!: Observable<Exchange[] | null>;

  protected readonly Cryptocurrency = Cryptocurrency;

  protected data: CryptoTrade[] = [
    {
      name: Cryptocurrency.DOGE,
      symbol: 'DOGE',
      price: 0,
      img: 'assets/img/svg/doge.svg'
    },
    {
      name: Cryptocurrency.BTC,
      symbol: 'BTC',
      price: 0,
      img: 'assets/img/svg/btc.svg'
    },
    {
      name: Cryptocurrency.ETH,
      symbol: 'ETH',
      price: 0,
      img: 'assets/img/svg/eth.svg'
    }
  ];
  protected exchanges: Exchange[] = [];
  protected streamError: boolean = false;

  constructor(
    private marketStreamService: MarketStreamService,
    private exchangeService: ExchangeService
  ) {
  }

  ngOnInit() {
    this.getTradesMapSubject();
    this.getExchangesSubject();
  }

  private getTradesMapSubject() {
    this.trades$ = this.marketStreamService.getTradesMapSubject()
      .pipe(
        tap((tradesMap: Map<string, number> | null) => {
          if(tradesMap === null) {
            console.error('Error fetching trades map')

            this.streamError = true;
          }
        }),
        filter((tradesMap: Map<string, number> | null) => tradesMap?.size === this.data.length),
        tap((tradesMap: Map<string, number> | null) => {
          this.data.forEach((trade: CryptoTrade) => {
            trade.price = tradesMap!.get(trade.name) || 0;
          });
        })
      );
  }

  private getExchangesSubject() {
    this.exchanges$ = this.exchangeService.getExchangesSubject()
      .pipe(
        filter((exchanges: Exchange[] | null) => !!exchanges),
        map((exchanges: Exchange[] | null) => {
          return exchanges!.filter((exchange: Exchange) => Number(exchange.volumeUsd) > 0);
        }),
        tap((exchanges: Exchange[] | null) => {
          this.exchanges = exchanges!;
        })
      );
  }
}
