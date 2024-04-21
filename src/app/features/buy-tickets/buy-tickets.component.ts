import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {MarketStreamService} from "../services/market-stream.service";
import {filter, Observable, tap} from "rxjs";
import {Cryptocurrency} from "../../core/enums/cryptocurrency.enum";
import {AsyncPipe, DecimalPipe, NgIf} from "@angular/common";
import {LoaderComponent} from "../../shared/loader/loader.component";
import {sumValidator} from "../../core/validators/sum.validator";

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    LoaderComponent,
    DecimalPipe
  ],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss'
})
export class BuyTicketsComponent implements OnInit {

  trades$!: Observable<Map<string, number> | null>;

  dogePrice: number = 0;
  totalPrice: number = 0;
  isDiscountApplied: boolean = false;
  ticketsForm: FormGroup = new FormGroup({
    standard: new FormControl(0, [Validators.min(0)]),
    premium: new FormControl(0, [Validators.min(0)])
  }, {validators: sumValidator()});

  protected standardTicketPrice: number = 4;
  protected premiumTicketPrice: number = 16;
  protected visible: boolean = false;

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

  addTicket(formControlName: string) {
    const formControl = this.ticketsForm.get(formControlName);
    formControl?.setValue(formControl.value + 1);
  }

  removeTicket(formControlName: string) {
    const formControl = this.ticketsForm.get(formControlName);
    formControl?.setValue(formControl.value - 1);
  }

  updateTotal(): number {
    const standard = this.ticketsForm.get('standard')?.value;
    const premium = this.ticketsForm.get('premium')?.value;

    const total = (standard * this.standardTicketPrice + premium * this.premiumTicketPrice) / this.dogePrice;

    return total > 0 && !(standard < 0) && !(premium < 0) ? total : 0;
  }

  applyDiscount(): number {
    const total = this.updateTotal();

    if ((this.ticketsForm.get('standard')?.value + this.ticketsForm.get('premium')?.value) > 1) {
      this.isDiscountApplied = true;

      return total * 0.95;
    }

    this.isDiscountApplied = false;

    return total;
  }

  lockBasketTotal() {
    this.totalPrice = this.applyDiscount();
  }
}
