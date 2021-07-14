import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/dist/types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly url = 'https://free.currconv.com/api/v7/convert?q=';
  private readonly apiKeyParam = '&apiKey=c9e7b0f5c2f81c4ae04d';

  constructor(private readonly http: HttpClient) {}

  getRates(rateId: string): Observable<number> {
    return this.http
      .get(this.url + rateId + '&compact=ultra' + this.apiKeyParam)
      .pipe(map(x => x[rateId]));
  }
}
