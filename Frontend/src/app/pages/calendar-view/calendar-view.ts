// This file provides a month-grid calendar view of events, using signals for date navigation and event data.
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScheduleService } from '../../services/schedule';
import { CalendarEvent } from '../../models/event.model';

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.scss',
})
export class CalendarViewComponent implements OnInit {
  private scheduleService = inject(ScheduleService);

  events = this.scheduleService.events;
  loading = this.scheduleService.loading;
  error = this.scheduleService.error;

  currentDate = signal(new Date());

  monthLabel = computed(() => {
    return this.currentDate().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  });

  weeks = computed<CalendarDay[][]>(() => {
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    const allEvents = this.events();
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      const dayEvents = allEvents.filter((e) => {
        const eventDate = new Date(e.startTime);
        return (
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      });

      days.push({
        date,
        inCurrentMonth: date.getMonth() === month,
        events: dayEvents,
      });
    }

    const weeks: CalendarDay[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  });

  ngOnInit(): void {
    this.scheduleService.loadAll();
  }

  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  today(): void {
    this.currentDate.set(new Date());
  }

  deleteEvent(event: CalendarEvent, mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();

    const confirmed = confirm(`Delete event "${event.title}"?`);

    if (!confirmed) {
      return;
    }

    this.scheduleService.deleteEvent(event.id);
  }
}