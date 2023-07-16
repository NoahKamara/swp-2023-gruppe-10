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
  
  @Input()
  public item!: EventListItem;

  public isFavorite= false;

  didClickFavButton(): void {
    if(this.isFavorite === false){
      this.isFavorite = true;
    }
    else{
      this.isFavorite = false;
    }
  }

  constructor(@Inject(LOCALE_ID) public locale: string){}

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
