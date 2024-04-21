import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MegaMenuItem} from "primeng/api";
import {MegaMenuModule} from "primeng/megamenu";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {filter, Observable, tap} from "rxjs";
import {Cryptocurrency} from "../../core/enums/cryptocurrency.enum";
import {MarketStreamService} from "../../features/services/market-stream.service";
import {HeaderMinComponent} from "./header-min/header-min.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MegaMenuModule, RouterLink, NgOptimizedImage, DropdownModule, FormsModule, AsyncPipe, NgIf, HeaderMinComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Output() toggleModeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected trades$!: Observable<Map<string, number> | null>

  protected dogePrice: number = 0;
  protected items: MegaMenuItem[] = [
    {
      label: 'So Home',
      routerLink: 'home'
    },
    {
      label: 'Market',
      routerLink: 'market'
    }
  ];

  protected lightMode: boolean = false;

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
        filter((tradesMap: Map<string, number> | null) => tradesMap!.has(Cryptocurrency.DOGE)),
        tap((tradesMap: Map<string, number> | null) => {
          this.dogePrice = tradesMap!.get(Cryptocurrency.DOGE)!;
        })
      );
  }
  protected toggleMode() {
    this.lightMode = !this.lightMode;

    this.toggleModeEvent.emit(this.lightMode);
  }
}


