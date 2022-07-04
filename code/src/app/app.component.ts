import { Component, OnInit } from '@angular/core';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar} from '@fortawesome/free-regular-svg-icons';
import { getLocal, remove } from 'src/localStorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ticker:any=''
  title = 'front-endd';
  fasStar = fasStar;
  farStar = farStar;

  ngOnInit(){
    this.ticker=getLocal('currentTicker');
    console.log('on reload', this.ticker)
    remove('currentTicker')
  }
}


