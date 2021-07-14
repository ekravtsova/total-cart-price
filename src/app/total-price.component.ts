import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/dist/types';
import { CurrencyService } from './currency.service';
import { IPrice } from './interfaces';
import { Totals } from './totals';

const ratesDict: Record<string, string> = {
  rubles: 'RUB',
  euros: 'EUR',
  dollars: 'USD',
  pounds: 'GBP',
  yens: 'JPY'
};

@Component({
  selector: 'total-price',
  templateUrl: './total-price.component.html',
  styleUrls: ['./total-price.component.css']
})
export class TotalPriceComponent implements OnInit, OnDestroy {
  @Input() cart: IPrice[];

  private readonly _subscriptions = new Array<Subscription>();

  totals: Totals = new Totals();
  isRounded: boolean;
  errorMessages: string[] = [];
  isError: boolean;

  constructor(private readonly currencyService: CurrencyService) {}

  ngOnInit() {
    this.calculateTotals();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(x => x.unsubscribe());
    this.errorMessages = [];
  }

  retryCalculation() {
    this._subscriptions.forEach(x => x.unsubscribe());
    this.isError = false;
    this.errorMessages = [];
    this.calculateTotals();
  }

  private calculateTotals() {
    let cartSum = this.cart.reduce((sum, current) => sum + current.price, 0);
    this.totals.dollars = cartSum;

    Object.keys(this.totals)
      .filter(x => x != 'dollars')
      .forEach(x => {
        let rateId = ratesDict.dollars + '_' + ratesDict[x];

        this._subscriptions.push(
          this.currencyService.getRates(rateId).subscribe({
            next: result => {
              this.totals[x] = result * cartSum;
            },
            error: (error: HttpErrorResponse) => {
              this.errorMessages.push(
                `The exchange rate service doesn't work correctly. Please try later. Rate ID is ` +
                  rateId +
                  '. ' +
                  error.error.error
              );
              this.isError = true;
              this.totals[x] = null;
            }
          })
        );
      });
  }
}
