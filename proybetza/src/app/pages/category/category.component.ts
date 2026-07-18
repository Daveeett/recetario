import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import type { Category } from '../../models/recipe.model';
import type { Recipe } from '../../models/recipe.model';

const LABELS: Record<string, string> = {
  dulce: 'Dulce', salada: 'Salada',
  agridulce: 'Agridulce', postre: 'Postre', bebida: 'Bebida'
};

@Component({
  selector: 'app-category',
  imports: [RecipeCardComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export default class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  readonly recipes = signal<Recipe[]>([]);
  readonly label = signal('Categoria');
  readonly loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') as Category;
      this.label.set(LABELS[slug] ?? slug);
      this.loading.set(true);
      this.recipeService.getByCategory(slug).subscribe({
        next: res => { this.recipes.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    });
  }
}