import { Component, Input } from '@angular/core';
import { PublicTicket } from 'softwareproject-common';

@Component({
  selector: 'app-ticket-list-item',
  templateUrl: './ticket-list-item.component.html',
  styleUrls: ['./ticket-list-item.component.css']
})
export class TicketListItemComponent {
  @Input()
  public item!: PublicTicket;
}
