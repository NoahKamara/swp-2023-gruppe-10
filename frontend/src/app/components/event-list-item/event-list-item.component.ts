import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { EventListItem } from 'softwareproject-common';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css']
})
export class EventListItemComponent {
  public isFavorite = false;

  didClickFavButton(): void {
    if(this.isFavorite === false){
      this.isFavorite = true;
    }
    else{
      this.isFavorite = false;
    }
  }
  
  @Input()
  public item!: EventListItem;


  constructor(@Inject(LOCALE_ID) public locale: string){}

  dateFormat(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
