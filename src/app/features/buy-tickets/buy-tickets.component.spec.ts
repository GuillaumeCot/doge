import {TestBed} from "@angular/core/testing";
import {BuyTicketsComponent} from "./buy-tickets.component";
import {BehaviorSubject, of} from "rxjs";
import {MarketStreamService} from "../services/market-stream.service";
import {Cryptocurrency} from "../../core/enums/cryptocurrency.enum";

describe("BuyTicketsComponent", () => {
  let component: BuyTicketsComponent;
  let marketStreamService: MarketStreamService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyTicketsComponent],
      providers: [MarketStreamService],
    }).compileComponents();

    marketStreamService = TestBed.inject(MarketStreamService);
    component = new BuyTicketsComponent(marketStreamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize trades$ observable", () => {
    const mockData = new Map<string, number>().set(Cryptocurrency.DOGE, 100);

    jest.spyOn(marketStreamService, "getTradesMapSubject").mockReturnValue(
      of(mockData) as BehaviorSubject<Map<string, number> | null>
    );

    component.ngOnInit();
    component.trades$.subscribe((data) => {
      expect(data).toBe(mockData);
      expect(component.dogePrice).toBe(100);
    });
  });

  it("should increment ticket count", () => {
    component.ticketsForm.get("standard")?.setValue(1);

    component.addTicket("standard");

    expect(component.ticketsForm.get("standard")?.value).toBe(2);
  });

  it("should decrement ticket count", () => {
    component.ticketsForm.get("standard")?.setValue(1);

    component.removeTicket("standard");

    expect(component.ticketsForm.get("standard")?.value).toBe(0);
  });

  it("should calculate total", () => {
    component.ticketsForm.get("standard")?.setValue(2); // 2*4 = 8
    component.ticketsForm.get("premium")?.setValue(3); // 3*16 = 48
    component.dogePrice = 0.16;

    const total = component.updateTotal();

    expect(total).toBe(350); // (8+48)/0.16 = 350
  });

  it("should calculate discount", () => {
    component.ticketsForm.get("standard")?.setValue(2);
    component.ticketsForm.get("premium")?.setValue(3);
    component.dogePrice = 0.16;

    const totalWithDiscount = component.applyDiscount();

    expect(totalWithDiscount).toBe(332.5);
  });

  it("should store total price with discount", () => {
    component.ticketsForm.get("standard")?.setValue(2);
    component.ticketsForm.get("premium")?.setValue(3);
    component.dogePrice = 0.16;

    component.lockBasketTotal();

    expect(component.totalPrice).toBe(component.applyDiscount());
    expect(component.totalPrice).toBe(332.5);
    expect(component.isDiscountApplied).toBe(true);
  });

  it("should store total price without discount", () => {
    component.ticketsForm.get("standard")?.setValue(-1);
    component.ticketsForm.get("premium")?.setValue(-1);
    component.dogePrice = 0.16;

    component.lockBasketTotal();

    expect(component.totalPrice).toBe(component.applyDiscount());
    expect(component.totalPrice).toBe(0);
    expect(component.isDiscountApplied).toBe(false);
  });
});
