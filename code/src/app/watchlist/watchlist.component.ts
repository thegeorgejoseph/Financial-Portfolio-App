
import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { getLocal, remove, updateLocal } from 'src/localStorage';
import { Component, OnInit } from '@angular/core';


import { distinct, first } from 'rxjs/operators';
import { data } from 'highcharts';



@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistData: any = [];
  watchlistEmpty = true;
  quoteData:any = {}
  curWatchlist:any = []

  constructor() {}

  delete(tickerToDelete: string) {
    let curWatchlist = [];
    if (getLocal('watchlistCompanies')) {
      curWatchlist = getLocal('watchlistCompanies');
    }
    curWatchlist = curWatchlist.filter(
      (ticker: string) => ticker != tickerToDelete
    );

    if(curWatchlist.length == 0){
      this.watchlistEmpty = true
    }else{
      this.watchlistEmpty = false
    }
    remove(tickerToDelete)
    updateLocal('watchlistCompanies', curWatchlist);

  }

  ngOnInit(): void {

    this.curWatchlist = getLocal('watchlistCompanies') || [];

    if(this.curWatchlist.length == 0){
      this.watchlistEmpty = true
    }else{
      this.watchlistEmpty = false
    }


  }

  }

