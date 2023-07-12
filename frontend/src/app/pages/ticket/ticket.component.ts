import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicTicket } from 'softwareproject-common';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) public locale: string, private ticketService: TicketsService, private route: ActivatedRoute, private router: Router) {}

  public ticket: PublicTicket | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      console.error('No ID Present');
      this.router.navigateByUrl('/tickets');
      return;
    }

    this.ticketService.details(id).subscribe(val => {
      this.ticket = val;
    });
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
