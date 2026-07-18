import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { PreferencesService } from '../../services/preferences.service';
import { AuthService } from '../../services/auth.service';
import { NgIconComponent } from '@ng-icons/core';
import type { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, NgIconComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export default class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private prefs = inject(PreferencesService);
  readonly auth = inject(AuthService);

  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loading.set(true);
      this.recipeService.getById(id).subscribe({
        next: res => { this.recipe.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }

  userAllergens(): string[] {
    const r = this.recipe();
    if (!r) return [];
    return r.ingredients.filter(i => this.prefs.isAllergen(i));
  }

  isFavorite(ing: string): boolean { return this.prefs.isFavorite(ing); }
  isAllergen(ing: string): boolean { return this.prefs.isAllergen(ing); }

  toggleFav(ing: string): void {
    if (!this.auth.isLoggedIn()) return;
    this.prefs.toggleFavorite(ing);
  }

  categoryLabel(cat: string): string {
    const map: Record<string, string> = {
      dulce: 'Dulce', salada: 'Salada',
      agridulce: 'Agridulce', postre: 'Postre', bebida: 'Bebida'
    };
    return map[cat] || cat;
  }

  difficultyLabel(d: string): string {
    const map: Record<string, string> = { facil: 'Facil', media: 'Media', dificil: 'Dificil' };
    return map[d] || d;
  }
}