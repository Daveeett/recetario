import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { PreferencesService } from '../../services/preferences.service';
import { AuthService } from '../../services/auth.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { NgIconComponent } from '@ng-icons/core';
import type { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  imports: [RecipeCardComponent, RouterLink, NgIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private prefs = inject(PreferencesService);
  readonly auth = inject(AuthService);

  readonly shuffled = signal<Recipe[]>([]);
  readonly recommended = signal<Recipe[]>([]);
  readonly loading = signal(true);
  readonly loadingRecommended = signal(false);

  ngOnInit(): void {
    this.recipeService.list({ limit: 35 }).subscribe({
      next: res => {
        const arr = [...res.data];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        this.shuffled.set(arr);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    if (this.auth.isLoggedIn()) {
      this.loadingRecommended.set(true);
      this.recipeService.getRecommended().subscribe({
        next: res => {
          this.recommended.set(res.data.slice(0, 8));
          this.loadingRecommended.set(false);
        },
        error: () => this.loadingRecommended.set(false),
      });
    }
  }

  hasFavorites(): boolean {
    return this.prefs.favoriteIngredients().length > 0;
  }
}