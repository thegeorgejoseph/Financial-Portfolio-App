import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { getLocal, updateLocal, remove } from 'src/localStorage';
import { FormControl } from '@angular/forms';
import {
  distinctUntilChanged,
  debounceTime,
  takeUntil,
  tap,
  switchMap,
} from 'rxjs/operators';
import { StateService } from '../state.service';
import { setLines } from '@angular/material/core';
import { convertToObject } from 'typescript';
import { Subject, timer } from 'rxjs';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.css'],
})
export class SearchTabComponent implements OnInit {
  searchIp = new FormControl('');
  ticker: any;
  inputFill: any;

  private destroyed$ = new Subject();
  interval: any;

  refreshing = true;
  param: any;
  userSubscription: any;
  quoteDetails: any = {};

  currentTicker = '';
  loadFlag = false;

  tickerError = '';

  localTicker = 'home';
  autocompleteResult: any = [];

  loader: string = 'inactive';
  isLoadingAutoComplete = false;
  companyDetails: any = {};
  inputText: string = '';
  errorticker:any=''
  constructor(
    private apiCalls: ApiCallsService,
    private stateService: StateService,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {
    this.searchSubmit = this.searchSubmit.bind(this);

    this.ticker = [];
    this.autocompleteResult = [];

    this.stateService._error.subscribe((errorObj: any) => {
      // console.log(errorObj);
      if (errorObj.error) {
        this.tickerError = errorObj.message;
        this.loader = 'inactive';
        setTimeout(() => {
          this.tickerError = '';
        }, 5000);
        remove('currentTicker')

      }
    });

  }
  @ViewChild('searchInput') search: string | undefined;

  searchSubmit(query: any) {
    this.ticker = query;
    this.stateService.errorReset();
    if (this.searchIp.value === '') {
      this.tickerError = 'Please Enter a valid ticker';
      // console.log('error');
      return;
    }
    this.loader = 'loading';

    this.companyDetails = {};

    this.ticker = typeof this.ticker === 'string' ? this.ticker : this.ticker.displaySymbol;

    if(this.ticker == getLocal('currentTicker')){
      remove('currentTicker')
      this.stateService.addCompany(this.ticker);
    }
    this.router.navigateByUrl('/search/' + this.ticker);
    // console.log('in search submit')
    this.search = '';

    // this.loader = 'loading';
    let currentStack: any = {};

    // this.stateService.addCompany(this.param.ticker);
    return false;
  }
  searchClear() {
    // updateLocal("currentTicker", "home")
    this.search = '';
    this.companyDetails = {};
    // this.localTicker = "home"
    this.stateService.resetData();
    this.loader = 'inactive';
    this.tickerError = '';
    updateLocal('currentTicker', '');
    this.router.navigateByUrl('search/home');
    this.searchIp.setValue('')
  }

  autoUpdateCompanyDetails() {
    setTimeout(
      () => {
        if (this.localTicker != 'home') {
          this.companyDetails = getLocal(this.localTicker);
        }
        this.autoUpdateCompanyDetails();
      },

      15000
    );
  }

  autocompleteSearch() {
    if (this.searchIp.value === '') {
      this.autocompleteResult = [];
      return;
    }

    this.isLoadingAutoComplete = true;
    this.autocompleteResult = []
    this.apiCalls.autoComplete(this.searchIp.value).subscribe((data: any) => {
      if (data.name == 'Error') {
        this.tickerError = data.message;
        setTimeout(() => {
          this.tickerError = '';
        }, 5000);
      } else {
        this.autocompleteResult = data;

        this.isLoadingAutoComplete = false;
      }
    });
  }

  displayFunc(result: any) {
    // let res = `${result.displaySymbol} | ${result.description}`

    return result.displaySymbol;
  }

  ngOnChanges(): void {}
  ngOnInit(): void {
    // console.log(this.searchIp);
    this.searchIp.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((res) => {

        this.autocompleteSearch();
      });

    this.userSubscription = this.activated_route.params.subscribe(
      (params: Params) => {
        this.param = params;


        if (params['ticker'] != 'home') {
          if (!params['ticker']) {
            // console.log(' error no ticker case');
            this.loader = 'inactive';
            let e = {
              error: true,
              message: 'Please Enter a valid ticker',
              ticker: '',
            };
            this.stateService.errorSubject.next(e);
          }
          else if (params['ticker'] != 'home') {
            // console.log('inside b?lank');
            this.searchIp.setValue(params['ticker']);
            this.loader = 'loading';
            this.stateService.addCompany(this.param.ticker);
            this.stateService.addQuote(this.param.ticker);
          }
          this.currentTicker = getLocal('currentTicker');


        }
        else if (params['ticker'] == 'home'){

          remove('currentTicker')
          this.searchClear()
        }
      }
    );

    this.stateService.companyDetails.subscribe((data) => {
      if (data.profile.ticker) {

        this.companyDetails = data;
        // console.log('inside company subscribe');
        if(this.currentTicker == this.param.ticker){
          this.loader = 'loaded'
        }

        // console.log(this.companyDetails.profile.ticker);
        this.loader = 'loaded';

      }
    });

    this.stateService.quoteDetails.subscribe((data: any) => {

      if (data[0]) {
        this.quoteDetails = data[0];
      }
    });

    if (
      this.loader == 'loaded' &&
      this.companyDetails.quote.marketStatus == 'open'
    ) {
      this.interval = setInterval(() => {
        this.stateService.refreshQuoteState(this.param.ticker);
        console.log('refreshing');
      }, 15000);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
