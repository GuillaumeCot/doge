import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {Exchange} from "../../core/models/exchange.model";
import {HttpClient} from "@angular/common/http";
import {ExchangesDto} from "../../core/dtos/exchanges.dto";

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private exchangesSubject = new BehaviorSubject<Exchange[] | null>(null);

  constructor(
    private http: HttpClient
  ) {
  }

  getExchanges(): Observable<Exchange[] | null> {
    const req = this.http.get<ExchangesDto>('https://api.coincap.io/v2/exchanges');

    return req.pipe(
      map((exchangesDto: ExchangesDto) => {
        const data = exchangesDto.data.map(exchangeDto => {
          return new Exchange(
            exchangeDto.id,
            exchangeDto.name,
            exchangeDto.rank,
            exchangeDto.percentTotalVolume,
            exchangeDto.volumeUsd,
            exchangeDto.tradingPairs,
            exchangeDto.socket,
            exchangeDto.exchangeUrl,
            exchangeDto.updated
          );
        });

        this.setExchangesSubject(data);

        return data;
      }),
      catchError((error: Error) => {
        console.error('Error fetching exchanges', error);

        this.setExchangesSubject([]);

        return of([]);
      })
    );
  }

  getExchangesSubject(): BehaviorSubject<Exchange[] | null> {
    return this.exchangesSubject;
  }

  setExchangesSubject(exchanges: Exchange[] | null): void {
    this.exchangesSubject.next(exchanges);
  }
}
