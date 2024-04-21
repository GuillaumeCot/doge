import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class MarketStreamService {

  private tradesMap = new Map<string, number>();
  private tradesMapSubject = new BehaviorSubject<Map<string, number> | null>(this.tradesMap);

  subscribeToMarketStreamsTrade(symbols: string[]): Observable<Map<string, number> | null> {
    const s = symbols.map(symbol => `${symbol}`).join(',');
    const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${s}`);
    // const ws = new WebSocket(`wss://derp`);

    return new Observable(subscriber => {
      ws.onopen = () => {
        console.log('Connected to market stream');
      };

      ws.onmessage = (message) => {
        Object.keys(JSON.parse(message.data)).forEach((key) => {
          this.tradesMap.set(key, JSON.parse(message.data)[key]);
        });

        this.setTradesMapSubject(this.tradesMap);

        subscriber.next(this.tradesMap);
      };

      ws.onerror = () => {
        this.setTradesMapSubject(null);

        subscriber.next(null);
      };

      ws.onclose = () => {
        subscriber.complete();
        console.log('Disconnected from market stream');
      };
    });
  }

  getTradesMapSubject(): BehaviorSubject<Map<string, number> | null> {
    return this.tradesMapSubject;
  }

  setTradesMapSubject(tradesMap: Map<string, number> | null): void {
    this.tradesMapSubject.next(tradesMap);
  }
}
