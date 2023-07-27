import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
import { formatDate } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css']
})
export class EventListItemComponent implements OnInit {
  public isFavorite = false;
  @Input()
  public item!: EventListItem;
  public return: void | undefined;




  constructor(@Inject(LOCALE_ID) public locale: string ,private eventService: EventService){}
  ngOnInit(): void {
    const id = this.item.id;

    // fetch event
    const Favorite = this.eventService.isFavorite(id.toString());
    Favorite.subscribe({
    next: (value) => {
        this.isFavorite = value;
      },
      error: console.error
    });

  }
  // public Favorite = this.eventService.isFavorite(this.id.toString());
  // Favorite.subscribe({
  //     next: (value) => {
  //     this.isFavorite = value;
  //   },
  //   error: console.error
  // });

  didClickFavButton(): void {
    const id = this.item.id;
    const data = this.eventService.toggleFavorite(id.toString());
      data.subscribe({
        next: (value) =>
          this.return = value,
      });

      this.isFavorite = !this.isFavorite;
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
