import { updateLocal } from 'src/localStorage';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { tap, catchError } from 'rxjs/operators';
import { ApiCallsService } from './api-calls.service';
import { getLocal, remove } from '../localStorage';


import { companyDetailsData } from './companyDetailsData';
import { dataInterface } from './dataInterface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  companyObject = {
    profile: {
      ticker: '',
      name: '',
      exchange: '',
      ipo: '',
      finnhubIndustry: '',
      logo: '',
      weburl: '',
    },
    charts: {
      title: '',
      data: {
        olhc: [],
        volume: [],
      },
    },
    news: [],
    quote: {
      name: '',
      c: 0,
      d: 0,
      dp: 0,
      h: 0,
      l: 0,
      o: 0,
      pc: 0,
      t: 0,
      marketStatus: '',
      timestamp: '',
      charts: [
        {
          title: '',
          data: 0,
        },
      ],
    },
    insights: {
      reddit: {
        mention: 0,
        positiveMention: 0,
        negativeMention: 0,
      },
      twitter: {
        mention: 0,
        positiveMention: 0,
        negativeMention: 0,
      },
      recommendation: {
        categories: [],
        series: [],
      },
      earnings: {
        categories: [],
        actual: [],
        estimate: [],
      },
      name: '',
    },
    peers: [],
  };

  quoteObj = {
    name: '',
    c: 0,
    d: 0,
    dp: 0,
    h: 0,
    l: 0,
    o: 0,
    pc: 0,
    t: 0,
    marketStatus: '',
    timestamp: '',
    charts: [
      {
        title: '',
        data: 0,
      },
    ],
  };

  errorObj = {
    error: false,
    message: '',
    ticker: '',
  };

  portfolioAlertObj = {
    money: 0,
    isStockBought: false,
    isStockSold: false,
    stock: '',
  };

  public portfolioAlertSubject = new BehaviorSubject(this.portfolioAlertObj);
  _portfolioAlert = this.portfolioAlertSubject.asObservable();

  public errorSubject = new BehaviorSubject(this.errorObj);
  _error = this.errorSubject.asObservable();

  private _companyDetailsSubject = new BehaviorSubject(this.companyObject);
  companyDetails = this._companyDetailsSubject.asObservable();
  newCompany: companyDetailsData = {};

  private quoteSubject = new BehaviorSubject(this.quoteObj);
  quoteDetails = this.quoteSubject.asObservable();
  // newCompany:companyDetailsData={}

  getCompanyDetailsSubject() {
    return this._companyDetailsSubject.asObservable();
  }

  addCompany(ticker: '') {
    console.log(ticker);
    let newCompany: any = {};
    console.log('************ add company ' + JSON.stringify(ticker));
    let currentTicker = getLocal('currentTicker');
    console.log('currentTicker', currentTicker)
    console.log('newTicker', ticker)
    console.log(this._companyDetailsSubject)
    if (!currentTicker || currentTicker != ticker) {
      console.log('init')
      this.apiCalls.getCompanyDetailsAPI(ticker).subscribe(
        (data: any) => {
          if (data.name == 'Error') {
            console.log('error handling case 3');
            let e = {
              error: true,
              message: 'No data found. Please enter a valid ticker',
              ticker: ticker,
            };
            this.errorSubject.next(e);
            // remove('currentTicker')
          }

          if (!data.profile.ticker) {
            console.log('set error right 1');
            let e = {
              error: true,
              message: 'No data found. Please enter a valid ticker',
              ticker: ticker,
            };

            this.errorSubject.next(e);
            // remove('currentTicker')
          }

            this._companyDetailsSubject.next(data);
            console.log('init ticker api call')
            updateLocal('currentTicker', ticker)

        },
        (error: any) => {
          console.log(error);
          let e = {
            error: true,
            message: 'API Limit Reached. Please reload',
            ticker: '',
          };
          this.errorSubject.next(e);
        }
      );
    }

  }

  addQuote(ticker: '') {
    this.apiCalls.quoteAPI(ticker).subscribe((data: any) => {
      this.quoteSubject.next(data);
      console.log('quote addded');
    });
    // return this.quoteSubject.asObservable();
  }

  refreshQuoteState(ticker: ''): Observable<Object> {
    return this.apiCalls.quoteAPI(ticker).pipe(
      tap((data: any) => {
        this.quoteSubject.next(data);
        console.log('done refresh');
      })
    );
  }

  portfolioReset() {
    let curBalance = this.portfolioAlertSubject.getValue().money;
    let temp = {
      money: curBalance,
      isStockBought: false,
      isStockSold: false,
      stock: '',
    };
    console.log('is it resetting: ', temp);
    this.portfolioAlertSubject.next(temp);
  }
  resetData() {
    this._companyDetailsSubject.next(this.companyObject);
    console.log('resetting', this.errorObj);
    this.errorSubject.next(this.errorObj);
  }
  errorReset(){
    this.errorSubject.next(this.errorObj);
  }

  constructor(private apiCalls: ApiCallsService) {}
}
