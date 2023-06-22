import { Component, OnInit } from '@angular/core';
import { Ticket } from 'softwareproject-common';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  constructor(private ticketService: TicketsService) { }

  tickets: Ticket[] = [];

  ngOnInit(): void {
    this.ticketService.listTickets().subscribe({
      next: (value) => {
        console.log(value);
        this.tickets = value;
      },
      error: console.error
    });
  }
}
