// This file provides the Super Admin system dashboard: platform-wide KPIs, role breakdown chart, growth chart, and recent companies, using signals.
import { Component, OnInit, AfterViewInit, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

import { AdminService } from '../../services/admin';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('roleChartRef') roleChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('growthChartRef') growthChartRef!: ElementRef<HTMLCanvasElement>;

  private adminService = inject(AdminService);

  overview = this.adminService.overview;
  recentCompanies = this.adminService.recentCompanies;
  loading = this.adminService.loading;
  error = this.adminService.error;

  private roleChart: Chart | null = null;
  private growthChart: Chart | null = null;
  private viewReady = signal(false);

  constructor() {
    effect(() => {
      const roleData = this.adminService.usersByRole();
      const growthData = this.adminService.companyGrowth();

      if (this.viewReady() && roleData.length) {
        this.renderRoleChart(roleData);
      }

      if (this.viewReady() && growthData.length) {
        this.renderGrowthChart(growthData);
      }
    });
  }

  ngOnInit(): void {
    this.adminService.loadAll();
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
  }

  private renderRoleChart(data: { role: string; count: number }[]): void {
    this.roleChart?.destroy();

    this.roleChart = new Chart(this.roleChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map((d) => d.role),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: ['#73c8a9', '#73b3c8', '#ffc857', '#ff8080', '#c873c8', '#c8a873'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: '#f8fafc' } },
        },
      },
    });
  }

  private renderGrowthChart(data: { month: string; count: number }[]): void {
    this.growthChart?.destroy();

    this.growthChart = new Chart(this.growthChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: 'New Companies',
            data: data.map((d) => d.count),
            borderColor: '#73c8a9',
            backgroundColor: 'rgba(115, 200, 169, 0.15)',
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: '#f8fafc' } },
        },
        scales: {
          x: { ticks: { color: '#f8fafc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#f8fafc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
      },
    });
  }
}