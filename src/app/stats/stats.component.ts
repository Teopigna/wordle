import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { Stats, StatsService } from '../services/stats-service.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent implements OnInit {

  stats?: Stats;
  ratio?: number;

  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      
    },
  };
  public barChartLabels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
  ];
  public barChartLegend = false;

  public barChartData :any;

  public chartColors = ['']  

  constructor(private statsService: StatsService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void { 
    this.stats = this.statsService.getStats();  
    this.ratio = Math.round(this.stats.wins*100/this.stats.gamesPlayed);
    this.statsService.statsChange.subscribe(value => {
      this.stats = value;
      this.ratio = Math.round(value.wins*100)/value.gamesPlayed;
      this.changeDetector.detectChanges();
    })
    this.barChartData = [
      { data: this.stats?.dist, backgroundColor: '#77ed79' }
    ];
  }

}
