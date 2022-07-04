import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import HData from 'highcharts/modules/data';
import HMore from "highcharts/highcharts-more";
import HExporting from "highcharts/modules/export-data";
import HIndicators from "highcharts/indicators/indicators";
import HVBP from "highcharts/indicators/volume-by-price";

HIndicators(Highcharts)
HVBP(Highcharts)
HExporting(Highcharts)
HMore(Highcharts)

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  highcharts = Highcharts;
  recommendationChartOptions:Highcharts.Options = {};
  earningsChartOptions:Highcharts.Options = {};
  @Input("insights") insights: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:any): void{

    //check
    console.log('inside ng on change insigh')
    console.log(this.insights.earnings.estimate)
    if(changes.insights.isFirstChange())
    {
      this.chartUpdate()
    }
    else if(changes.insights.previousValue.name != changes.insights.currentValue.name){
      this.chartUpdate()
    }
  }

  chartUpdate(){
    this.recommendationChartOptions = {
      title: {
          text: `Recommendation Trends`,
      },
      chart: {
          type: 'column'
      },


      plotOptions: {
          series: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              },
          }
      },
      series: this.insights.recommendation.series,
      xAxis: {
          categories: this.insights.recommendation.categories
      },

      yAxis: {
          min: 0,
          title: {
              text: '#Analysis'
          },
      },

  }

    // getRecommendationChartOptions(this.insights.recommendation)
    this.earningsChartOptions = {
      title: {
          text: `Historical EPS Surprises`,
      },
      tooltip: {
        shared: true
      },
      xAxis: {
          type: 'linear',
          scrollbar: {
              enabled: true
          },
          categories: this.insights.earnings.categories
      },
      yAxis: [{
          title: {
              text: 'Quarterly EPS',
          },
      }],
      series: [{
          type: 'spline',
          name: 'Actual',
          data: this.insights.earnings.actual,
          color: "#7bb5ec"
      }, {
          type: 'spline',
          name: 'Estimate',
          data: this.insights.earnings.estimate,
          color: "#434343",
      }]
  }
  }

}
