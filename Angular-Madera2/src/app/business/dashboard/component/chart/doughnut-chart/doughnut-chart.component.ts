import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  public doughnutChartLabels = ['Terminé', 'En Cours', 'En Attente'];
  public doughnutChartData = [10, 60, 30];
  public doughnutChartColor = ['rgba(219, 127, 56, 1)', 'rgba(246, 95, 8, 1)', 'rgba(162, 70, 17, 1)'];
  public doughnutChartType = 'doughnut';

  public constructor() { }

  public ngOnInit(): void {
    this.initChart();
  }

  public initChart(): void {
    var myChart = new Chart("doughnutChart", {
      type: 'doughnut',
      data: {
          labels: this.doughnutChartLabels,
          datasets: [{
              data: this.doughnutChartData,
              backgroundColor : this.doughnutChartColor,
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
            text: "The 3 states of quote"
          },
          legend: {
            display: false
          }
      }
  });
  }

}
