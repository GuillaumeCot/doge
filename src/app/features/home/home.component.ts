import {Component, OnInit} from '@angular/core';
import {MarketStreamService} from "../services/market-stream.service";
import {filter, Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {Cryptocurrency} from "../../core/enums/cryptocurrency.enum";
import {LoaderComponent} from "../../shared/loader/loader.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    LoaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  protected readonly Cryptocurrency = Cryptocurrency;

  protected trades$!: Observable<Map<string, number> | null>;

  constructor(
    private marketStreamService: MarketStreamService
  ) { }

  ngOnInit(): void {
    this.getTradeEventSubject();
  }

  private getTradeEventSubject() {
    this.trades$ = this.marketStreamService.getTradesMapSubject()
      .pipe(
        filter((tradesMap: Map<string, number> | null) => !!tradesMap),
        filter((tradesMap: Map<string, number> | null) => tradesMap!.has(Cryptocurrency.DOGE))
      );
  }

}
