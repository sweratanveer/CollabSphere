// This file provides the analytics dashboard page: KPI cards, charts, project progress, and employee performance tables, using signals.
import { Component, OnInit, AfterViewInit, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { ReportsService } from '../../services/reports';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('statusChartRef') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityChartRef') priorityChartRef!: ElementRef<HTMLCanvasElement>;

  private reportsService = inject(ReportsService);

  summary = this.reportsService.summary;
  projectProgress = this.reportsService.projectProgress;
  employeePerformance = this.reportsService.employeePerformance;
  loading = this.reportsService.loading;
  error = this.reportsService.error;

  private statusChart: Chart | null = null;
  private priorityChart: Chart | null = null;
  private viewReady = signal(false);

  constructor() {
    effect(() => {
      const statusData = this.reportsService.tasksByStatus();
      const priorityData = this.reportsService.tasksByPriority();

      if (this.viewReady() && statusData.length) {
        this.renderStatusChart(statusData);
      }

      if (this.viewReady() && priorityData.length) {
        this.renderPriorityChart(priorityData);
      }
    });
  }

  ngOnInit(): void {
    this.reportsService.loadAll();
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
  }

  private renderStatusChart(data: { status: string; count: number }[]): void {
    this.statusChart?.destroy();

    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.status),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: ['#73c8a9', '#73b3c8', '#ffc857', '#ff8080'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: { color: '#f8fafc' },
          },
        },
      },
    });
  }

  private renderPriorityChart(data: { priority: string; count: number }[]): void {
    this.priorityChart?.destroy();

    this.priorityChart = new Chart(this.priorityChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.priority),
        datasets: [
          {
            label: 'Tasks',
            data: data.map((d) => d.count),
            backgroundColor: '#73c8a9',
            borderRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: '#f8fafc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#f8fafc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    });
  }
}