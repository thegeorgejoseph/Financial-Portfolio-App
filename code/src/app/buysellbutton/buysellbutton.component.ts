import { StateService } from './../state.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { updateLocal, getLocal, remove } from '../../localStorage';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-buysellbutton',
  templateUrl: './buysellbutton.component.html',
  styleUrls: ['./buysellbutton.component.css'],
})
export class BuysellbuttonComponent {
  faXmark = faXmark;
  @Input('buyStockAlert') buyStockAlert: Function = () => {};
  @Input('sellStockAlert') sellStockAlert: Function = () => {};
  @Input('source') source: string = 'search';
  @Input('ticker') ticker: string = '';
  @Input('value') value: number = 0;
  @Input('quote') quote: any = {};
  @Input('transactionUpdate') transactionUpdate: Function = () => {};

  moneyInWallet = 0;
  currentQuantity: number = 0;
  quantityValue = new FormControl(0);
  tval = 0;
  errorMessage = '';
  transactionType = 'Buy';
  constructor(
    private modalService: NgbModal,
    private stateService: StateService
  ) {}

  open(content: any, transactionType: string) {
    this.transactionType = transactionType;
    this.modalService.open(content);
  }

  changeInQuantity() {
    this.tval = parseFloat(
      (this.value * parseFloat(this.quantityValue.value)).toFixed(2)
    );
    if (this.transactionType === 'Sell') {
      if (parseFloat(this.quantityValue.value) > this.currentQuantity) {
        this.errorMessage = "You don't have enough stocks to sell!";
      } else if (this.quantityValue.value < 1) {
        this.errorMessage = 'You should sell atleast 1 stock';
      } else {
        this.errorMessage = '';
      }
    } else {
      if (this.tval > this.moneyInWallet) {
        this.errorMessage = 'Not enough money in wallet!';
      } else if (this.quantityValue.value < 1) {
        this.errorMessage = 'You should buy atleast 1 stock';
      } else {
        this.errorMessage = '';
      }
    }
  }

  updateQuantity() {
    this.moneyInWallet = getLocal('money') || 25000;
    let stockQty = getLocal('stockQty') || {};
    if (stockQty[this.ticker]) {
      this.currentQuantity = stockQty[this.ticker].quantity || 0;
    } else {
      this.currentQuantity = 0;
    }

    console.log('current quantity', this.currentQuantity);
  }

  ngOnChanges(changes: any) {
    this.updateQuantity();
  }

  transaction() {
    if (this.transactionType === 'Sell') {
      let stockQty = getLocal('stockQty') || {};

      stockQty[this.ticker].tval -= this.tval;

      let curBalance = this.moneyInWallet + this.tval;
      curBalance = parseFloat(curBalance.toFixed(2));

      stockQty[this.ticker].quantity -= parseFloat(this.quantityValue.value);

      stockQty[this.ticker].tval = parseFloat(
        stockQty[this.ticker].tval.toFixed(2)
      );
      stockQty[this.ticker].quantity = parseFloat(
        stockQty[this.ticker].quantity.toFixed(2)
      );

      updateLocal('stockQty', stockQty);
      updateLocal('money', curBalance);

      if (this.source == 'search') {

        updateLocal(this.ticker, this.quote);
      }

      if (stockQty[this.ticker].quantity === 0) {
        delete stockQty[this.ticker];
        updateLocal('stockQty', stockQty);
        remove(this.ticker);
      }

      this.quantityValue.setValue(0);

      this.tval = 0;
      this.updateQuantity();
      this.transactionUpdate();
      this.sellStockAlert(this.ticker);

      this.stateService.portfolioAlertSubject.next({
        money: curBalance,
        isStockBought: false,
        isStockSold: true,
        stock: this.ticker,
      });
    } else {
      let stockQty = getLocal('stockQty') || {};

      if (!stockQty[this.ticker]) {
        stockQty[this.ticker] = {
          quantity: parseFloat(this.quantityValue.value),
          tval: this.tval,
        };
      } else {
        stockQty[this.ticker].quantity =
          (stockQty[this.ticker].quantity || 0) +
          parseFloat(this.quantityValue.value);
        stockQty[this.ticker].tval += this.tval;
      }

      let curBalance: number = this.moneyInWallet - this.tval;

      stockQty[this.ticker].quantity = parseFloat(
        stockQty[this.ticker].quantity.toFixed(2)
      );
      stockQty[this.ticker].tval = parseFloat(
        stockQty[this.ticker].tval.toFixed(2)
      );

      updateLocal('stockQty', stockQty);
      curBalance = parseFloat(curBalance.toFixed(2));
      updateLocal('money', curBalance);
      // updateLocal(this.ticker, this.quote);

      if (this.source == 'search') {
        console.log('company buy', this.quote);
        updateLocal(this.ticker, this.quote);
      }

      this.transactionUpdate();

      this.buyStockAlert(this.ticker);
      this.stateService.portfolioAlertSubject.next({
        money: curBalance,
        isStockBought: true,
        isStockSold: false,
        stock: this.ticker,
      });
    }
    this.updateQuantity();
  }
}
