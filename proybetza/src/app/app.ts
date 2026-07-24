import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService } from './services/sidebar.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  readonly sidebarService = inject(SidebarService);
  private themeService = inject(ThemeService); // Instancia ThemeService al arrancar

  isAuthRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/login') || url.startsWith('/register');
  }
}