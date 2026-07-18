import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../services/auth.service';
import type { ForumPost, PostType } from '../../models/forum.model';

@Component({
  selector: 'app-forum',
  imports: [FormsModule, RouterLink, NgIconComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export default class ForumComponent implements OnInit {
  private forumService = inject(ForumService);
  readonly auth = inject(AuthService);

  readonly posts = signal<ForumPost[]>([]);
  readonly loading = signal(true);
  readonly filterType = signal<'review' | 'request' | 'all'>('all');
  readonly sortType = signal<'newest' | 'popular'>('newest');

  // Formulario de creación
  readonly newTitle = signal('');
  readonly newContent = signal('');
  readonly newPostType = signal<PostType>('request');
  readonly creating = signal(false);
  readonly createError = signal('');
  readonly showForm = signal(false);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.forumService.list({
      type: this.filterType(),
      sort: this.sortType()
    }).subscribe({
      next: res => {
        this.posts.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setFilter(type: 'review' | 'request' | 'all'): void {
    this.filterType.set(type);
    this.loadPosts();
  }

  setSort(sort: 'newest' | 'popular'): void {
    this.sortType.set(sort);
    this.loadPosts();
  }

  toggleLike(post: ForumPost): void {
    if (!this.auth.isLoggedIn()) return;
    this.forumService.toggleLike(post.id).subscribe({
      next: res => {
        // Actualizamos localmente el post
        this.posts.update(arr => arr.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              userHasLiked: res.data.liked,
              likesCount: res.data.likesCount
            };
          }
          return p;
        }));
      }
    });
  }

  deletePost(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.forumService.delete(id).subscribe({
        next: () => {
          this.posts.update(arr => arr.filter(p => p.id !== id));
        }
      });
    }
  }

  submitPost(): void {
    if (!this.newTitle().trim() || !this.newContent().trim()) {
      this.createError.set('Por favor completa todos los campos.');
      return;
    }

    this.creating.set(true);
    this.createError.set('');

    this.forumService.create({
      title: this.newTitle(),
      content: this.newContent(),
      postType: this.newPostType()
    }).subscribe({
      next: (res) => {
        this.posts.update(arr => [res.data, ...arr]);
        this.newTitle.set('');
        this.newContent.set('');
        this.creating.set(false);
        this.showForm.set(false);
      },
      error: (err) => {
        this.createError.set(err.error?.error?.message ?? 'Error al publicar.');
        this.creating.set(false);
      }
    });
  }
}
