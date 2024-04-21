import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {AsyncPipe, NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {MegaMenuItem} from "primeng/api";
import {RouterLink} from "@angular/router";
import {MarketStreamService} from "../../../features/services/market-stream.service";
import {filter, Observable, tap} from "rxjs";
import {Cryptocurrency} from "../../../core/enums/cryptocurrency.enum";

@Component({
  selector: 'app-header-min',
  standalone: true,
  imports: [
    SidebarModule,
    AsyncPipe,
    DropdownModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './header-min.component.html',
  styleUrl: './header-min.component.scss'
})
export class HeaderMinComponent implements OnInit {

  @Input() items!: MegaMenuItem[];

  @Output() toggleModeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected trades$!: Observable<Map<string, number> | null>

  protected dogePrice: number = 0;
  protected sidebarVisible = false;

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

}
