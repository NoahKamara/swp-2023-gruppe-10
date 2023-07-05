import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, Ticket } from 'softwareproject-common';
import { EventService } from 'src/app/services/event.service';
import { PaymentProvider } from 'src/app/components/payment-provider-btn/payment-provider-btn.component';
import { AnyPaymentData, TicketsService } from 'src/app/services/tickets.service';
import { tick } from '@angular/core/testing';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-event-payment',
  templateUrl: './event-payment.component.html',
  styleUrls: ['./event-payment.component.css']
})
export class EventPaymentComponent implements OnInit {
  public event: Event | null = null;
  public providers: PaymentProvider[] = [
    PaymentProvider.bachelorcard,
    PaymentProvider.hciPal,
    PaymentProvider.swpsafe
  ];

  providerEnum: typeof PaymentProvider = PaymentProvider;

  constructor(@Inject(LOCALE_ID) public locale: string, private route: ActivatedRoute, private router: Router, private eventService: EventService, private ticketService: TicketsService) { }

  public selectedProvider: PaymentProvider | null = null;

  public purchasedTicketID: number | null = null;

  didClick(): void {
    console.log('HELLO');
  }

  didSelect(provider: PaymentProvider): void {
    console.log('select', provider);
    this.selectedProvider = provider;
  }

  onPurchase(ticket: Ticket): void {
    this.purchasedTicketID = ticket.id;
  }

  submit(data: AnyPaymentData): void {
    if (!this.event) return;

    this.ticketService.purchaseTicket({
      eventID: this.event.id,
      paymentsData: data
    }).subscribe({
      next: (ticket) => {
        console.log('ticket', ticket);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No ID Present');
      this.router.navigateByUrl('/events');
      return;
    }

    // fetch event
    const observeEvent = this.eventService.detail(id);

    // When event succeeds, set local var
    observeEvent.subscribe({
      next: (value) => {
        this.event = value;
      },
      error: console.error
    });
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
