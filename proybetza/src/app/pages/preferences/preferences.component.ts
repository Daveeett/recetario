import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../services/preferences.service';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-preferences',
  imports: [RouterLink],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export default class PreferencesComponent implements OnInit {
  private prefs = inject(PreferencesService);
  private recipeService = inject(RecipeService);
  readonly auth = inject(AuthService);

  readonly allIngredients = this.recipeService.allIngredients;
  readonly favoriteIngredients = this.prefs.favoriteIngredients;
  readonly allergens = this.prefs.allergens;
  readonly intolerances = this.prefs.intolerances;

  readonly availableIntolerances = [
    'Intolerancia a la Lactosa',
    'Intolerancia al Gluten',
    'Alergia a los Mariscos',
    'Alergia a los Frutos Secos',
    'Alergia al Huevo'
  ];

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.prefs.loadFromBackend();
    }
  }

  isFav(ing: string): boolean { return this.prefs.isFavorite(ing); }
  isAllergen(ing: string): boolean { return this.prefs.isAllergen(ing); }
  isIntolerance(int: string): boolean { return this.prefs.isIntolerance(int); }

  toggleFav(ing: string): void { this.prefs.toggleFavorite(ing); }
  toggleAllergen(ing: string): void { this.prefs.toggleAllergen(ing); }
  toggleIntolerance(int: string): void { this.prefs.toggleIntolerance(int); }
}