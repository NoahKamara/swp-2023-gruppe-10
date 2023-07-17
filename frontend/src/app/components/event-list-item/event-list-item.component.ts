import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css']
})
export class EventListItemComponent {
  public isFavorite = false;
  @Input()
  public item!: EventListItem;

 

  constructor(@Inject(LOCALE_ID) public locale: string ,private eventService: EventService){}

  public id = this.item.id;

  this.eventService.isFavorite(this.id.toString()).subscribe({
    next: (value) => {
      this.isFavorite = value;
    },
    error: console.error
  });
  didClickFavButton(): void {
    if(this.isFavorite === false){
      this.isFavorite = true;
      this.eventService.makeFavorite(this.id.toString());
    }
    else{
      this.isFavorite = false;
      this.eventService.makeFavorite(this.id.toString());
    }
  }

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
