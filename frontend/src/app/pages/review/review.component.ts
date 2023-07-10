import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  public rating = 0;

  public titleThisUser = '';
  public textThisUser = '';
  public nameThisUser = 'Student M.';
  public ratingUser = 4;
  public clicked = false;
  public reviewed = false;
  public helpfulThis = 0;
  public helpful = 15;

  getTitelUser(): string{
    console.log(this.titleThisUser);
    return this.titleThisUser;
  }

  onChangeTitel(titel:string): void{

  }

  setReviewed(): void{
    this.reviewed = true;
  }
  
  isReviewed(): boolean{
    return this.reviewed;
  }
  setChange(text:string): void{
    this.titleThisUser = text;
  }

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
  }

  getTitelU(titel:string){
    this.titleThisUser = titel;
  }

  getTextU(text:string){
    this.textThisUser = text;
  }

  setHelpful(): void{
    this.helpful = this.helpful+1;
  }

  }
