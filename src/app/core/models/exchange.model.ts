import {Adapter} from "../interfaces/adapter.interface";
import {ExchangeDto} from "../dtos/exchange.dto";

export class Exchange {
  constructor(
    private _id: string,
    private _name: string,
    private _rank: string,
    private _percentTotalVolume: string,
    private _volumeUsd: string,
    private _tradingPairs: string,
    private _socket: boolean,
    private _exchangeUrl: string,
    private _updated: number
  ) {
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get rank(): string {
    return this._rank;
  }

  set rank(value: string) {
    this._rank = value;
  }

  get percentTotalVolume(): string {
    return this._percentTotalVolume;
  }

  set percentTotalVolume(value: string) {
    this._percentTotalVolume = value;
  }

  get volumeUsd(): string {
    return this._volumeUsd;
  }

  set volumeUsd(value: string) {
    this._volumeUsd = value;
  }

  get tradingPairs(): string {
    return this._tradingPairs;
  }

  set tradingPairs(value: string) {
    this._tradingPairs = value;
  }

  get socket(): boolean {
    return this._socket;
  }

  set socket(value: boolean) {
    this._socket = value;
  }

  get exchangeUrl(): string {
    return this._exchangeUrl;
  }

  set exchangeUrl(value: string) {
    this._exchangeUrl = value;
  }

  get updated(): number {
    return this._updated;
  }

  set updated(value: number) {
    this._updated = value;
  }
}

export class ExchangeAdapter implements Adapter<ExchangeDto, Exchange> {
  fromDTO(item: ExchangeDto): Exchange {
    return new Exchange(
      item.id,
      item.name,
      item.rank,
      item.percentTotalVolume,
      item.volumeUsd,
      item.tradingPairs,
      item.socket,
      item.exchangeUrl,
      item.updated
    );
  }
}
