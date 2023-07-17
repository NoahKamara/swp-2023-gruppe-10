import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
    if(this.isFavorite === false){
      const data = this.eventService.makeFavorite(id.toString());
      data.subscribe({
        next: (value) =>
          this.return = value,
      });
      this.isFavorite = true;
    }
    else{
      const data = this.eventService.makeFavorite(id.toString());
      data.subscribe({
        next: (value) =>
          this.return = value,
      });
      this.isFavorite = false;
    }
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
