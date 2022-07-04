import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-company-tabs',
  templateUrl: './company-tabs.component.html',
  styleUrls: ['./company-tabs.component.css']
})
export class CompanyTabsComponent implements OnInit {
@Input('result') result: any;
@Input('quote') quote: any;
@Input('searchSubmit') searchSubmit=(t:any)=>{}
  constructor() { }

  ngOnInit(): void {
  }

}
