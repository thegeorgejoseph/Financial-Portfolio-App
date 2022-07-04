import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { getLocal, remove, updateLocal } from 'src/localStorage';
import { ApiCallsService } from './../api-calls.service';
import { Router } from '@angular/router';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.css']
})
export class WatchlistCardComponent implements OnInit {

  @Input('ticker') ticker:any = ''
  @Output() onRemove = new EventEmitter();
  quoteDetails:any = {};
  watchlistEmpty = true

  searchTicker(ticker: string) {
    this.router.navigateByUrl('search/' + ticker);
  }

  removeTicker(){
    this.onRemove.emit(this.ticker)
  }

  faXmark = faXmark;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  constructor(private router: Router, private apiCalls: ApiCallsService) { }

  ngOnInit(): void {
    console.log('ticker inside card:', this.ticker)
    this.quoteDetails = getLocal(this.ticker)

    this.apiCalls.quoteAPI(this.ticker).pipe(debounceTime(1000)).subscribe((data:any) =>{
      if(data[0].name){
        this.quoteDetails = data[0]
        updateLocal(this.ticker, this.quoteDetails)
      }

    },
    error => console.log('Error in Wtchlist: ',error.error.message))

  }




}
