import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatSelectModule} from '@angular/material/select'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchTabComponent } from './search-tab/search-tab.component';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { BuysellbuttonComponent } from './buysellbutton/buysellbutton.component';
import { CompanyTabsComponent } from './company-tabs/company-tabs.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SummaryComponent } from './summary/summary.component';
import { NewsComponent } from './news/news.component';
import { ChartsComponent } from './charts/charts.component';
import { InsightsComponent } from './insights/insights.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import {HighchartsChartModule} from 'highcharts-angular';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component'

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    SearchTabComponent,
    CompanydetailsComponent,
    NavBarComponent,
    WatchlistComponent,
    BuysellbuttonComponent,
    CompanyTabsComponent,
    SummaryComponent,
    NewsComponent,
    ChartsComponent,
    InsightsComponent,
    WatchlistCardComponent,
    PortfolioCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatTabsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatCardModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
