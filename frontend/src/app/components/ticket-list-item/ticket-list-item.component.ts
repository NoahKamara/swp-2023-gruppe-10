import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { PublicTicket } from 'softwareproject-common';

@Component({
  selector: 'app-ticket-list-item',
  templateUrl: './ticket-list-item.component.html',
  styleUrls: ['./ticket-list-item.component.css']
})
export class TicketListItemComponent {
  @Input()
  public item!: PublicTicket;

  constructor(@Inject(LOCALE_ID) public locale: string){}

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
