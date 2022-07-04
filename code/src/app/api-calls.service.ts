import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/catch';

import { HOST } from './host-name';



@Injectable({
  providedIn: 'root'
})

export class ApiCallsService {

  private searchUrlPre = HOST + 'autocomplete/';
  private companyUrlPre = HOST + 'company_details';
  private quoteUrl = HOST + 'stock_quote';


  constructor(private http: HttpClient) { }

  autoComplete(searchTerm : string){
    const url =  `${this.searchUrlPre}?q=${searchTerm}`;
    return this.http.get(url)

  }

  getCompanyDetailsAPI(ticker: string){
    const url = `${this.companyUrlPre}?symbol=${ticker}`;
    return this.http.get(url)
    // .catch((err: HttpErrorResponse) => {
    //   // simple logging, but you can do a lot more, see below
    //   console.error('An error occurred:', err.error);
    // });

  }

  quoteAPI(ticker: string){
    const url = `${this.quoteUrl}?symbol=${ticker}`;
    console.log(url)
    return this.http.get(url)

  }
}
