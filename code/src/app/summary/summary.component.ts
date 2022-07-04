import { StateService } from './../state.service';
import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import HData from 'highcharts/modules/data';
import HMore from 'highcharts/highcharts-more';
import HExporting from 'highcharts/modules/export-data';
import HIndicators from 'highcharts/indicators/indicators';
import HVBP from 'highcharts/indicators/volume-by-price';


HIndicators(Highcharts);
HVBP(Highcharts);
HExporting(Highcharts);
HMore(Highcharts);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  @Input('result') result: any;
  quote: any;

  @Input('searchSubmit') searchSubmit = (t: any) => {};
  highcharts = Highcharts;
  constructor(private stateService:StateService) {}

  ngOnInit(): void {
    this.stateService.quoteDetails.subscribe((data: any) => {

      if (data[0]) {
        this.quote = data[0];
      }
    });
  }

  chartOptions: Highcharts.Options = {};

  ngOnChanges(changes: any) {
    if (changes.result) {
      if (
        changes.result.isFirstChange() ||
        changes.result.previousValue.name != changes.result.currentValue.name
      ) {
        console.log('chart title');
        console.log(this.result.quote.charts[0].title);
        this.chartOptions = {
          title: {
            text: `<div style="color:#737373">${this.result.quote.charts[0].title}</div>`,
            useHTML: true,
          },
          chart: {
            marginRight: 20,
            marginLeft: 20,
          },
          xAxis: {
            type: 'datetime',
            scrollbar: {
              enabled: true,
            },
          },
          yAxis: [
            {
              labels: {
                align: 'right',
              },
              title: {
                text: '',
              },
              opposite: true,
            },
          ],
          legend: {
            enabled: false,
          },
          series: [
            {
              type: 'line',
              name: 'Stock Price',
              data: this.result.quote.charts[0].data,
              // .map(([ date, value]) => {return [date, value]; })
              color:
                this.result.quote.dp > 0
                  ? '#367b21'
                  : this.result.quote.dp < 0
                  ? '#ea3323'
                  : '#000',
              marker: {
                enabled: false,
              },
              threshold: null,
            },
          ],
        };
      }
    }
  }
}
