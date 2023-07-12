import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateReview, PublicReview } from 'softwareproject-common';
import { ReviewService } from 'src/app/services/review.service';


@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  constructor(private review: ReviewService, private router: Router, private route: ActivatedRoute) {}

  // Name of the location
  private locationName!: string;

  ngOnInit(): void {
    // Retrieve location name from path
    const name = this.route.snapshot.paramMap.get('name');

    if (!name) {
      console.error('No name Present');
      this.router.navigateByUrl('/map');
      return;
    }

    this.locationName = name;

    // Fetch user's review
    this.review.mine(this.locationName).subscribe({
      next: (review) => {
        this.myReview = review;
        console.log(review);
      }
    });

    // Fetch all other reviews
    this.review.all(this.locationName).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      }
    });
  }

  // Other reviews
  public reviews: PublicReview[] = [];

  // User's review - undefined if not reviewed yet
  public myReview?: PublicReview;

  // FormGroup for creating new review
  public newReview = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required]),
    stars: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    description: new FormControl<string | null>(null, [Validators.required]),
  });

  // Set Stars of new review
  setStars(stars: number): void {
    this.newReview.controls.stars.setValue(stars);
  }

  // submit review
  submitReview(): void {
    // make errors show up
    this.newReview.markAsTouched();

    if (!this.newReview.valid) return;

    const values = this.newReview.value;

    const review: CreateReview = {
      stars: values.stars ?? 1,
      title: values.title ?? 'ERR NO TITLE',
      comment: values.description ?? undefined
    };

    // Post review & set myReview upon success
    this.review.post(this.locationName,review).subscribe({
      next: (val) => {
        this.myReview = val;
      }
    });
  }


  starIcon(star: number, stars: number): string {
    if (star <= stars) {
      return 'star';
    } else if (star <= stars + 0.5) {
      return 'star_half';
    } else {
      return 'grade';
    }
  }
}
