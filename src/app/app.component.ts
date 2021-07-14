import { Component } from '@angular/core';
import { IPrice } from './interfaces';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

  selectedCart: IPrice[] = [
       { price: 20 },
       { price: 45 },
       { price: 67 },
       { price: 1305 }
    ];
    
}
