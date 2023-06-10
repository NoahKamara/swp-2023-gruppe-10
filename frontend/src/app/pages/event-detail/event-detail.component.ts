import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'softwareproject-common';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  public event!: Event;

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No ID Present');
      this.router.navigateByUrl('/events');
      return;
    }

    this.eventService.detail(id).subscribe({
      next: (value) => {
        this.event = value;
      },
      error: console.error
    });
  }
}
