import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  public constructor() {}

  public ngOnInit(): void {
    this.initChart();
  }

  public initChart(): void {
    var myChart = new Chart("barChart", {
      type: 'bar',
      data: {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
          datasets: [{
              data: [290, 344, 263, 365, 400, 322, 200, 250, 327, 383, 400, 383, 327, 281, 281, 322, 327, 383, 250, 281],
              backgroundColor : 'rgba(219, 127, 56, 1)',
          }]
      },
      options: {
          scales: {
            xAxes: [{
              stacked: true,
              display: true
            }],
            yAxes: [{
              display: true,
              ticks: {
                  beginAtZero: true
              },
            }],
          },
          title: {
            display: true,
            fontSize: 24,
            fontColor: '#373737',
            text: "Amount of sales"
          },
          legend: {
            display: false
          }
      }
  });
  }

}
