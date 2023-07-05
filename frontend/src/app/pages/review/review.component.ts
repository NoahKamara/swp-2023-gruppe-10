import { Component } from '@angular/core';
import {MDCTextField} from '@material/textfield';



@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})

export class ReviewComponent {

  public rating = 0;
  public ratingUser = 3.5;
  public clicked = false;


  getIcon(star:number): string{
    console.log(this.rating);

    if(star <= this.rating){
        return 'star';
    } else if(star <= this.rating +0.5){
      return 'star_half';
    } else{
      return 'grade';
    }
  }
  getIconUser(star:number): string{

    if(star <= this.ratingUser){
        return 'star';
    } else if(star <= this.ratingUser +0.5){
      return 'star_half';
    } else{
      return 'grade';
    }
  }

  getStars(star:number): void{
    this.rating = star;
    this.clicked = true;
    console.log(this.rating);
  }


}
