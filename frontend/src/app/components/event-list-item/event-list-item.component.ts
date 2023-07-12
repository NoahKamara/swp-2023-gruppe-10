import { Component, Input } from '@angular/core';
import { EventListItem } from 'softwareproject-common';

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
    if(this.isFavorite === false){
      this.isFavorite = true;
    }
    else{
      this.isFavorite = false;
    }
  }
}
