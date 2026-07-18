import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  readonly recipe = input.required<Recipe>();

  categoryLabel(cat: string): string {
    const map: Record<string, string> = {
      dulce: 'Dulce',
      salada: 'Salada',
      agridulce: 'Agridulce',
      postre: 'Postre',
      bebida: 'Bebida'
    };
    return map[cat] || cat;
  }

  difficultyLabel(d: string): string {
    const map: Record<string, string> = {
      facil: 'Facil',
      media: 'Media',
      dificil: 'Dificil'
    };
    return map[d] || d;
  }
}