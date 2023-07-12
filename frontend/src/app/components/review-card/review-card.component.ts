import { Component, Input } from '@angular/core';
import { PublicReview } from 'softwareproject-common';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {

  @Input()
  isOwn = false;

  @Input()
  review!: PublicReview;

  setHelpful(): void{
    this.review.helpful = this.review.helpful+1;
  }

  starIcon(star: number): string{
    if(star <= this.review.stars){
        return 'star';
    } else if(star <= this.review.stars +0.5){
      return 'star_half';
    } else{
      return 'grade';
    }
  }
}
