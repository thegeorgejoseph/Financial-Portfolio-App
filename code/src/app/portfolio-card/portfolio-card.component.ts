import { Component, OnInit, Input } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { getLocal } from 'src/localStorage';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio-card',
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.css'],
})
export class PortfolioCardComponent implements OnInit {
  @Input('buyStockAlert') buyStockAlert: Function = () => {};
  @Input('sellStockAlert') sellStockAlert: Function = () => {};
  @Input('portfolioUpdate') portfolioUpdate: Function = () => {};
  @Input('ticker') ticker: any = '';
  @Input('value') value: any = '';

  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  moneyInWallet = 0;
  currentQuantity: number = 0;
  quantityValue = new FormControl(0);


  noPortfolioCompanies = false;
  companyDetails: any = {};
  avgCost: any = '';
  quoteDetails:any = {}

  isStockSold = false;
  isStockBought = false;
  stock = '';

  searchTicker() {
    this.router.navigateByUrl('search/' + this.ticker);
  }


  transactionUpdate() {
    console.log("transaction updating");
    if (getLocal('money')) {
      this.moneyInWallet = getLocal('money');
    } else {
      this.moneyInWallet = 25000;
    }

    this.avgCost = parseFloat(
      (this.value.tval / this.value.quantity).toFixed(2)
    );

    this.quoteDetails = getLocal(this.ticker)
    this.companyDetails = {
      quote: this.quoteDetails,
      qty: this.value.quantity,
      avgCost: this.avgCost,
      marketVal: parseFloat((this.value.quantity * this.quoteDetails.l).toFixed(2)),
      tcost: this.value.tval,
      change: this.quoteDetails.l - this.avgCost,
    };




  }

  constructor(private apiCalls: ApiCallsService, private router: Router) {
    this.transactionUpdate = this.transactionUpdate.bind(this);
    this.buyStockAlert = this.buyStockAlert.bind(this);
    this.sellStockAlert = this.sellStockAlert.bind(this);
  }

  ngOnInit(): void {

    this.transactionUpdate()

    this.apiCalls.quoteAPI(this.ticker).pipe(debounceTime(1000)).subscribe(
      (data: any) => {
        if(data[0].name != '' && data[0].name){
          console.log(data.name)
          this.companyDetails = {
            quote: data[0],
            qty: this.value.quantity,
            avgCost: this.avgCost,
            marketVal: parseFloat((this.value.quantity * data[0].l).toFixed(2)),
            tcost: this.value.tval,
            change: data[0].l - this.avgCost,
          };

        }

      },
      (error) => console.log('error in watchlist: ', error.error.message)
    );


  }
}
