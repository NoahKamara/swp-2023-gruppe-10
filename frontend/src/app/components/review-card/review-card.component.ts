import { Component, Input } from '@angular/core';
import { PublicReview } from 'softwareproject-common';
import { ReviewService } from 'src/app/services/review.service';

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

  constructor(private reviews: ReviewService) {}

  setHelpful(): void {
    // console.log(`/api/helpful/${this.review.}`)
    this.reviews.toggleHelpful(this.review.id).subscribe({
      next: (count) => {
        this.review.helpful = count;
      },
      error: (err) => {
        console.error(err);
      }
    });
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
