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


  didClickFavButton(): void {
    const id = this.item.id;
    if(this.isFavorite === false){
      this.isFavorite = true;
      this.eventService.makeFavorite(id.toString());
    }
    else{
      this.isFavorite = false;
      this.eventService.makeFavorite(id.toString());
    }
  }

  constructor(@Inject(LOCALE_ID) public locale: string ,private eventService: EventService){}

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
