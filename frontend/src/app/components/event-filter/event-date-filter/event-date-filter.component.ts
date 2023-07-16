import { Component } from '@angular/core';
import { MatCalendarCellClassFunction, MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-event-date-filter',
  templateUrl: './event-date-filter.component.html',
  styleUrls: ['./event-date-filter.component.css']
})
export class EventDateFilterComponent {
  selectedDates: string[] = [];

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const dateToFind = this.getDateOnly(cellDate);
      const i = this.selectedDates.indexOf(dateToFind);
      if (i >= 0) {
        return 'selected';
      }
    }
    return '';
  };

  public startDate: Date | null = null;
  public endDate: Date | null = null;

  daySelected(date: Date | null,calendar: MatCalendar<Date>): void {
    console.log('change', date, calendar);
    // console.log(date);
    // if (date) {
    //   const dateSelected = this.getDateOnly(date);
    //   const i = this.selectedDates.indexOf(dateSelected);
    //   if (i >= 0) {
    //     this.selectedDates.splice(i,1);
    //   } else {
    //     this.selectedDates.push(dateSelected);
    //   }
    //   calendar.updateTodaysDate();
    // }
    this.startDate = date;

  // You can also access the selected cell element and apply additional custom styles if needed
    console.log(calendar.activeDate);
    calendar.focusActiveCell();
  }

  getDateOnly(date: Date):string {
    return date.toISOString().split('T')[0];
  }
}
