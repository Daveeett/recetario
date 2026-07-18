import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import type { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-search',
  imports: [RecipeCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export default class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  readonly query = signal('');
  readonly results = signal<Recipe[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('q') ?? '';
      this.query.set(q);
      if (q.trim()) {
        this.loading.set(true);
        this.recipeService.search(q).subscribe({
          next: res => { this.results.set(res.data); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
      } else {
        this.results.set([]);
      }
    });
  }
}