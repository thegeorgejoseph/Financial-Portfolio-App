import { Component, Input, OnInit } from '@angular/core';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import HData from 'highcharts/modules/data';
import HMore from 'highcharts/highcharts-more';
import HExporting from 'highcharts/modules/export-data';
import HIndicators from 'highcharts/indicators/indicators';
import HVBP from 'highcharts/indicators/volume-by-price';

HIndicators(Highcharts)
HVBP(Highcharts)
HExporting(Highcharts)
HMore(Highcharts)

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input('charts') charts:any;
  @Input('ticker') ticker:string = '';
  highcharts = Highcharts;
  chartOptions:Highcharts.Options = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:any): void{
    // console.log('inside ng onchanges')
    // console.log(this.charts.data)
    //check
    if(changes.charts.isFirstChange())
    {
      this.chartUpdate()
    }
    else if(changes.charts.previousValue.title != changes.charts.currentValue.title){
      this.chartUpdate()
    }
  }

  chartUpdate(){

    this.chartOptions = {
      chart:{
          marginLeft:40
      },
      rangeSelector: {
          enabled:true,
        },
      title: {
          text: this.charts.title
      },

      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      xAxis: {
          type: 'datetime',
      },

      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          },
          offset:0,
          opposite: true,
      }, {
          labels: {
              align: 'right',
              x: -2
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
          opposite: true,
      }],

      legend: {
          enabled: false
      },
      tooltip: {
          split: true
      },
      navigator:{
          enabled:true,
      },
      scrollbar: {
          enabled: true
      },

      series: [{
          type: 'candlestick',
          name: this.ticker,
          id: 'olhc',
          zIndex: 2,
          data: this.charts.data.olhc,
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.charts.data.volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'olhc',
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: 'olhc',
          zIndex: 5,
          marker: {
              enabled: false
          }
      }]
  }

  }

}
