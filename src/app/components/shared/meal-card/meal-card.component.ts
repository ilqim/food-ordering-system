// src/app/components/shared/meal-card/meal-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../../models';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.scss']
})
export class MealCardComponent {
  @Input() meal!: Meal;
  @Input() restaurantName: string = '';
  @Output() addToCart = new EventEmitter<Meal>();

  onAddToCart(): void {
    this.addToCart.emit(this.meal);
  }
}